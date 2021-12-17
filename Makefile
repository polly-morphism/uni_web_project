SHELL := /bin/bash

up:
	docker-compose -f docker-compose.prod.yml up -d

up-build:
	docker-compose -f docker-compose.prod.yml up -d --build

down:
	docker-compose -f docker-compose.prod.yml down -v

logs:
	docker-compose -f docker-compose.prod.yml logs -f

run-prod:
	docker-compose -f docker-compose.prod.yml down -v
	docker-compose -f docker-compose.prod.yml up -d --build
	docker-compose -f docker-compose.prod.yml exec web python manage.py makemigrations users
	docker-compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
	docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --no-input --clear
	docker-compose -f docker-compose.prod.yml logs -f

kill-ports:
	sudo kill -9 $(sudo lsof -t -i:80)
	sudo kill -9 $(sudo lsof -t -i:5432)
	sudo kill -9 $(sudo lsof -t -i:5672)
	sudo service apache2 stop


reset-docker:
	echo "Deactivating docker"
	docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml down
	docker rm -f $(docker ps -a -q)
	docker rmi -f $(docker images -a -q)
	docker volume rm $(docker volume ls -q)
	docker network rm $(docker network ls | tail -n+2 | awk '{if($2 !~ /bridge|none|host/){ print $1 }}')
	sudo service docker restart
