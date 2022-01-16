# 12 factors

✅ I. Codebase 
git
✅ II. Dependencies
requirements.txt + Dockerfile + Dockerfile.prod
✅ III. Config
.env.dev + .env.prod
? IV. Backing services
✅ V. Build, release, run
make up - run, make up-build - build and run, make run-prod - build frontend, backend and run 
✅ VI. Processes
Use nginx to support every 10k connections simulataneously in one process
✅ VII. Port binding
web: 8000, nginx: 80:80
✅ VIII. Concurrency
Use nginx to support every 10k connections simulataneously in one process
✅ IX. Disposability
make up, make down
✅ X. Dev/prod parity
Dockerfile + Dockerfile.prod, docker-compose + docker-compose.prod
✅ XI. Logs
make logs 
✅ XII. Admin processes
http://138.68.73.43/admin + https://cloud.digitalocean.com/projects/4ab668dc-40cf-4a6b-afc3-d53fd532c388/


# Схема розгортання системи 


run dev

$ docker-compose up -d --build
$ docker-compose exec web python manage.py migrate --noinput


run prod

$ make run-prod

# Реалізовано дві чи більше ролей з можливістю створення користувачів з різними ролями.
go to /admin/users to create admins or normal users, go to /register to register normal users
