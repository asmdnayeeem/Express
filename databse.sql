CREATE DATABASE signup;
CREATE TABLE users(
    user_id serial primary key,
    name varchar(255),
    email varchar(255),
    password varchar(255)
);