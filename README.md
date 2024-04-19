<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# API REST BASIS - NEST CON TYPEORM  

1. Clonar proyecto
2. ```npm install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
- DB_PASSWORD=
- DB_USERNAME=postgres
- DB_NAME=ecommerceDB
- BD_HOST=localhost
- DB_PORT=

4. Modificar las variables de entorno
5. Levantar la base de datos en un contenedor docker (Solo si tienes docker en tu dispositivo)
```
docker-compose up -d
```

6. Ejecutar SEED 
```
http://localhost:3000/api/seed
```

7. Levantar servidor liveRoloading: ```npm run start:dev```


## Dependencias
```
npm i @nestjs/serve-static
npm i bcrypt | npm i -D @types/bcrypt
npm i @nestjs/passport passport   | para autenticacion
npm i @nestjs/jwt passport-jwt
npm i -D @types/passport-jwt
```

