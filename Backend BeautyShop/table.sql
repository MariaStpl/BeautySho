create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

insert into user(name, contactNumber, email, password, status, role) values('Admin', '081243516781', 'admin@gmail.com', 'admin', 'true', 'admin');

create table category(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    primary key(id)
);

ALTER TABLE category CHANGE image icon VARCHAR(255);

create table product(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    categoryId integer NOT NULL,
    description varchar(255),
    price integer,
    status varchar(20),
    primary key(id),
    image VARCHAR(255)
);

create table bill(
    id int NOT NULL AUTO_INCREMENT,
    uuid varchar(200) NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    contactNumber varchar(20) NOT NULL,
    paymentMethod varchar(50) NOT NULL,
    total int,
    productDetails JSON DEFAULT NULL,
    createdBy varchar (255) NOT NULL,
    primary key (id)
);

create table bestseller(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    categoryId integer NOT NULL,
    description varchar(255),
    price integer,
    status varchar(20),
    primary key(id),
    image VARCHAR(255)
);

create table detail_product(
    id int NOT NULL AUTO_INCREMENT,
    item varchar(255) NOT NULL,
    categoryId integer NOT NULL,
    description varchar(255),
    price integer,
    status varchar(20),
    primary key(id),
    image VARCHAR(255)
);

create table cart(
    id int NOT NULL AUTO_INCREMENT,
    itemId integer NOT NULL,
    productId integer NOT NULL,
    total integer,
    quantity integer,
    primary key(id)
    alter table cart add createDate timestamp default current_timestamp not null;
    alter table cart add updateDate timestamp default current_timestamp not null;
);

create table orderCart(
    id integer NOT NULL AUTO_INCREMENT,
    itemId integer NOT NULL,
    productId integer NOT NULL,
    itemPrice integer,
    total integer,
    quantity integer,
    sumVal integer,
    primary key(id)
);

create table checkout(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    contactNumber varchar(20) NOT NULL,
    paymentMethod varchar(50) NOT NULL,
    primary key (id)
);

ALTER TABLE checkout ADD status varchar(50) NOT NULL;
ALTER TABLE checkout ADD address varchar(500) NOT NULL;
ALTER TABLE checkout ADD shipping_option varchar(50) NOT NULL;
alter table cart add createDate timestamp default current_timestamp not null;
alter table cart add updateDate timestamp default current_timestamp not null;
ALTER TABLE detail_product ADD productId integer NOT NULL;
ALTER TABLE orderCart ADD checkoutId integer NOT NULL;
alter table orderCart add orderTime timestamp default current_timestamp not null;
alter table orderCart add shipTime timestamp default current_timestamp;
alter table orderCart add completedTime timestamp default current_timestamp;
ALTER TABLE orderCart ADD status varchar(50) NOT NULL;