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