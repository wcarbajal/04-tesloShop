<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Teslo API

1. Clonar proyecto
2. Instalar los paquetes con yarn:
```
yarn install
```
3. Clonar el archivo ```.env.template ``` y renombrarlo a ``` .env```
4. Cambiar las variables de entorno en ```.env```
5. Levantar la base de datos
```
docker-compose up -d
```


6.  Ejecutar que llena la base de datos:
```
http://localhost:3000/api/seed
```
7.  Levantar la aplicación en modo desarrollo:
```
yarn start:dev
```