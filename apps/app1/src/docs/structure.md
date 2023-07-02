# Structure
Aim for this boilerplate is to support Domain Driven Structure and clean architecture. In order to aid such a folder structure has been defined.

In the end all boils down to that new features should be implemented using /srs/app and /@pjore/app1/modules. All else is supporting or shared entities and logics

# Root
Here goes all build, debug, lint, test and run configuration. Nothing to do here really.

# src
The start file and configuration loader (used as common configuration endpoint regardless what environment and where configuration is stored. ".env" is not to be used anywhere else)

## app
This is the routing and can be adjusted to whatever need there is. Note that app/index.ts is responsible to instantiate and pass any middleware or controllers needed by the endpoints

## docs
Well...

## modules
Here goes the domains and all its supporting implementations. Here is the magic.

### domains
This is the business domain. What are the expected entities from a user perspective. What make sense for a human. These describes the value objects, eg. a product with a certain properties and logics.

### repositories
Repositories implement the logics for a domain and when needed makes the data persistent. There can be several repositories for a single domain. Typically there is one repository for Unit Testing that is the reference in terms of logic, however only static sample data is used.

Default repository is defined by /@pjore/app1/modules/#module#/repositories/index.ts

### models
The domain describes the business object. Model describes the schema and methods used in order to make data persistent and in order to query data. Models are only used by repositories.

### controllers
The bridge between web client and the application, ie. how to manage Request/Response. Perhaps some mapping or aggregation is needed? Such goes here. Controllers utilize the default repository of given module.

## shared
Here goes all that are common for DO, eg. common interfaces, log management, authentication, common infrastructure (eg. mongodb, express, axios) and common utilities
