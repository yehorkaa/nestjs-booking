1.	Create new workspace:
npx create-nx-workspace@latest nestjs-booking-clone --preset=nest

2.	Generate shared package (name and path can be changed):
nx generate @nrwl/nest:library --name=utils --directory=shared --buildable --importPath=@nestjs-booking-clone/shared-utils

3.	Run the app with logs:
nx serve admin --verbose

4.	Build all apps and libraries:
nx run-many --target=build --all

5.	Remove a shared package:
nx g @nrwl/workspace:remove shared

6. ENV
ENV must be on the level of app, for example: apps/public/.env, and path for ConfigModule.forRoot and docker-compose should be changed
accordingly, like apps/public/.env

// TEMP
version: '3.8'

services:
  postgres_db:
    image: postgres:latest
    container_name: postgres_booking
    restart: always
    env_file:
      - ../.env
    environment:
      POSTGRES_USER: yeqorka
      POSTGRES_PASSWORD: test228
      POSTGRES_DB: postgres
    ports:
      - "5433:5432"
      # 5433 — это порт на твоей машине (host), то есть ты будешь подключаться к базе через localhost:5433, 
      # 5432 — это внутренний порт в контейнере, на котором PostgreSQL всегда работает по умолчанию
    volumes:
      # это путь к postgres_data_booking
      - postgres_data_booking:/var/lib/postgresql/data

# это надо чтоб докер не удалял данные при перезапуске контейнера и сам создал папку
volumes:
  postgres_data_booking:
    name: postgres_data_booking
