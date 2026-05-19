-- Políticas RLS para que los clientes autenticados accedan a su propio perfil.
-- El id del cliente debe coincidir con auth.uid() (se inserta así en el registro).

CREATE POLICY "Clientes leen su perfil" ON customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Clientes actualizan su perfil" ON customers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Clientes insertan su perfil al registrarse" ON customers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Para que el admin vea todos los clientes (requiere rol service_role o is_admin en metadata)
-- Configurar administrador: en Supabase Dashboard → Authentication → Users
-- → editar el usuario admin → Raw User Meta Data → {"is_admin": true}
