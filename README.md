# RUN PROJECT FROM SCRATCH

# run dev

$ docker-compose up -d --build
$ docker-compose exec web python manage.py migrate --noinput


# run prod

$ docker-compose -f docker-compose.prod.yml down -v
$ docker-compose -f docker-compose.prod.yml up -d --build
$ docker-compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
