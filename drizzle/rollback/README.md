# Rollback files

Drizzle only generates forward migrations. Every migration in `drizzle/` needs a matching
hand-written `rollback/<tag>.down.sql` that reverses it exactly; `npm run db:rollback` refuses
to run without one.

`npm run db:rollback` undoes the most recently applied migration: it runs the `.down.sql`
file and removes the migration's row from `drizzle.__drizzle_migrations`, in one transaction.
Run it again to step back further.
