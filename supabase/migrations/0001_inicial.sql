-- CAF · Ingeniería Fútbol 11 — esquema inicial
-- Roles: publico (sin login) · jugador · dt · dirigente · admin
-- Regla de oro: cédulas, carnés de salud, cuotas y finanzas SOLO para dirigente/admin.

create type rol_caf as enum ('jugador', 'dt', 'dirigente', 'admin');
create type fase_partido as enum ('regular', 'cuartos', 'semifinal', 'final', 'amistoso');
create type tipo_evento as enum ('gol', 'asistencia', 'amarilla', 'roja', 'atajada', 'gol_en_contra');
create type tipo_movimiento as enum ('ingreso', 'egreso');

-- ---------- Perfiles y roles ----------
create table perfiles (
  user_id uuid primary key references auth.users on delete cascade,
  nombre text not null,
  rol rol_caf not null default 'jugador',
  jugador_id uuid, -- se vincula a jugadores más abajo
  creado timestamptz not null default now()
);

create or replace function es_dirigencia() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from perfiles where user_id = auth.uid() and rol in ('dirigente', 'admin'));
$$;

create or replace function es_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from perfiles where user_id = auth.uid() and rol in ('dt', 'dirigente', 'admin'));
$$;

-- ---------- Deportivo (público) ----------
create table jugadores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  apodo text,
  posicion text check (posicion in ('ARQ', 'DEF', 'MED', 'DEL')),
  dorsal int,
  foto_url text,
  carrera text,
  fecha_nac date,          -- para cumpleaños (solo día/mes se muestra)
  extranjero boolean not null default false,
  activo boolean not null default true,
  creado timestamptz not null default now()
);
alter table perfiles add constraint perfiles_jugador_fk foreign key (jugador_id) references jugadores(id) on delete set null;

create table temporadas (
  anio int primary key,
  torneo text not null,
  resumen text,
  tabla jsonb not null default '[]'::jsonb  -- tabla final completa de la Liga
);

create table partidos (
  id uuid primary key default gen_random_uuid(),
  anio int not null references temporadas(anio),
  fase fase_partido not null,
  fecha_nro int,
  fecha timestamptz,
  cancha int,
  rival text not null,
  local boolean not null default true,
  goles_favor int,
  goles_contra int,
  penales text,
  notas text
);
create index on partidos (anio, fecha);

create table eventos_partido (
  id uuid primary key default gen_random_uuid(),
  partido_id uuid not null references partidos on delete cascade,
  jugador_id uuid references jugadores on delete set null,
  tipo tipo_evento not null,
  minuto int
);

create table mvp_votos (
  partido_id uuid references partidos on delete cascade,
  votante uuid references auth.users on delete cascade default auth.uid(),
  jugador_id uuid references jugadores on delete cascade,
  primary key (partido_id, votante)
);

-- ---------- Plantel ----------
create table convocatorias (
  partido_id uuid references partidos on delete cascade,
  jugador_id uuid references jugadores on delete cascade,
  disponible boolean,          -- lo marca el jugador
  convocado boolean default false, -- lo marca el DT
  primary key (partido_id, jugador_id)
);

-- ---------- Dirigencia (privado) ----------
create table fichajes (
  jugador_id uuid primary key references jugadores on delete cascade,
  cedula_hash text unique,     -- sha256, nunca la cédula en texto plano
  cedula_ult3 text,
  fecha_fichaje date,
  vence_carne date,
  carne_archivo text,          -- ruta en el bucket privado "carnes"
  notas text
);

create table sanciones (
  id uuid primary key default gen_random_uuid(),
  jugador_id uuid references jugadores on delete cascade,
  fecha date,
  motivo text,
  partidos int not null default 1,
  cumplidos int not null default 0
);

create table cuotas (
  jugador_id uuid references jugadores on delete cascade,
  mes date not null,            -- primer día del mes
  monto int not null,
  pagado boolean not null default false,
  exonerado boolean not null default false,
  fecha_pago date,
  medio text,
  primary key (jugador_id, mes)
);

create table movimientos (
  id uuid primary key default gen_random_uuid(),
  fecha date not null default current_date,
  tipo tipo_movimiento not null,
  categoria text not null,      -- cancha, juez, inscripción, indumentaria, sponsor, rifa, evento, cuota…
  concepto text,
  monto int not null check (monto > 0),
  comprobante text,
  creado_por uuid default auth.uid() references auth.users
);

create table presupuestos (
  anio int primary key,
  supuestos jsonb not null,     -- ver src/lib/presupuesto.ts (SupuestosTemporada)
  actualizado timestamptz not null default now()
);

create table beneficios (
  id uuid primary key default gen_random_uuid(),
  anio int not null,
  nombre text not null,         -- rifa, fiesta, sponsor de camiseta…
  meta int not null default 0,
  recaudado int not null default 0,
  estado text not null default 'idea' check (estado in ('idea', 'en-curso', 'hecho', 'descartado'))
);

-- ---------- Row Level Security ----------
alter table perfiles enable row level security;
alter table jugadores enable row level security;
alter table temporadas enable row level security;
alter table partidos enable row level security;
alter table eventos_partido enable row level security;
alter table mvp_votos enable row level security;
alter table convocatorias enable row level security;
alter table fichajes enable row level security;
alter table sanciones enable row level security;
alter table cuotas enable row level security;
alter table movimientos enable row level security;
alter table presupuestos enable row level security;
alter table beneficios enable row level security;

-- Público: lectura de lo deportivo
create policy "leer jugadores" on jugadores for select using (true);
create policy "leer temporadas" on temporadas for select using (true);
create policy "leer partidos" on partidos for select using (true);
create policy "leer eventos" on eventos_partido for select using (true);
-- Staff (DT y dirigencia) carga lo deportivo
create policy "staff escribe jugadores" on jugadores for all using (es_staff()) with check (es_staff());
create policy "staff escribe temporadas" on temporadas for all using (es_staff()) with check (es_staff());
create policy "staff escribe partidos" on partidos for all using (es_staff()) with check (es_staff());
create policy "staff escribe eventos" on eventos_partido for all using (es_staff()) with check (es_staff());

-- Perfiles: cada uno ve el suyo; dirigencia ve y cambia todos (gestión de roles)
create policy "mi perfil" on perfiles for select using (user_id = auth.uid() or es_dirigencia());
create policy "dirigencia gestiona perfiles" on perfiles for all using (es_dirigencia()) with check (es_dirigencia());

-- MVP: logueados votan una vez por partido, todos ven el conteo
create policy "ver votos" on mvp_votos for select using (auth.uid() is not null);
create policy "votar" on mvp_votos for insert with check (votante = auth.uid());

-- Convocatorias: el jugador marca su disponibilidad, el staff ve y convoca
create policy "ver convocatorias" on convocatorias for select using (auth.uid() is not null);
create policy "marcar mi disponibilidad" on convocatorias for insert
  with check (jugador_id = (select jugador_id from perfiles where user_id = auth.uid()));
create policy "actualizar mi disponibilidad" on convocatorias for update
  using (jugador_id = (select jugador_id from perfiles where user_id = auth.uid()) or es_staff());

-- Privado: el jugador ve SOLO lo suyo; dirigencia ve y edita todo
create policy "mi fichaje" on fichajes for select
  using (es_dirigencia() or jugador_id = (select jugador_id from perfiles where user_id = auth.uid()));
create policy "dirigencia fichajes" on fichajes for all using (es_dirigencia()) with check (es_dirigencia());

create policy "mis cuotas" on cuotas for select
  using (es_dirigencia() or jugador_id = (select jugador_id from perfiles where user_id = auth.uid()));
create policy "dirigencia cuotas" on cuotas for all using (es_dirigencia()) with check (es_dirigencia());

create policy "sanciones staff" on sanciones for select using (es_staff());
create policy "dirigencia sanciones" on sanciones for all using (es_dirigencia()) with check (es_dirigencia());

create policy "dirigencia movimientos" on movimientos for all using (es_dirigencia()) with check (es_dirigencia());
create policy "dirigencia presupuestos" on presupuestos for all using (es_dirigencia()) with check (es_dirigencia());
create policy "dirigencia beneficios" on beneficios for all using (es_dirigencia()) with check (es_dirigencia());

-- Bucket privado para fotos de carnés y comprobantes
insert into storage.buckets (id, name, public) values ('privado', 'privado', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true) on conflict do nothing;
create policy "dirigencia lee privado" on storage.objects for select using (bucket_id = 'privado' and es_dirigencia());
create policy "dirigencia sube privado" on storage.objects for insert with check (bucket_id = 'privado' and es_dirigencia());
create policy "staff sube fotos" on storage.objects for insert with check (bucket_id = 'fotos' and es_staff());
