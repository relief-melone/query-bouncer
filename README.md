# Query Bouncer

The Query Bouncer is a containerized Microservice to work together with [rm-Authenticator](https://github.com/relief-melone/rm-authenticator) as a versatile Role Based Access Control System for your Application.
It will do that by adjusting a database query sent from the backend in alignment with a users permissions. 
The updated query will be sent back and can be used to retrieve data from the database that the user is allowed to see/create...
Currently Queries for MongoDB are supported.

## Description of the elements

Here the core elements of the Query Bouncer will be described. Of course you can insert them manually in your database. But this section is here for
understanding how these elements are connected and work together. To manage those connections please refer to the [API](#api)

### Permissions

Permissions are the basis of everything. A typical Permission to grant read access will look like this

```json
{
  "Title": "readFavoriteBlogPosts",
  "Collection": "blogposts",
  "Right": "read",
  "QueryRestriction" : {
    "Topic" : "${FavoriteTopic}"
  }
}
```

#### Internal Permissions

Internal Permissions work in just the same way as regular ones do. But they manage Permissions for the Query Bouncer itsself. So in many cases you might want someone to be able to assign Roles to other users without giving them your admin Token to the service. Let's assume you want to assign an admin for your BlogPosts that is able to grant other People a Role of a Blogger. But the restriction is that this admin can only grant this permission if the Topic he wants this user to be able to read matches the one assigned for him as well. Then the internal Role Assignment would look like this. Don't worry too much about the Data Field in the PayloadRestriction. It will be explained in more detail in the [RoleAssignment Section](#roleassignments)

```json
{
  "Title": "AssignBlogger",
  "Collection": "roleassignments",
  "Right": "create",
  "PayloadRestriction" : {
    "Data": {
      "Topic": "${FavoriteTopic}"    
    }
  }
}
```

#### Title
The Title just identifies the permission and will be used to add it to the later described roles

#### Collection
The collection this permission refers to. In this fictional case we grant rights to read documents 
in the blogposts collection

#### Right
The right this permissions grants. In this case "read". It could also be "create", "update" or "delete"

#### QueryRestriction
The QueryRestriction is used to restrict the Query made to the database. For Read and Delete Operations only the QueryRestriction
is available. Later we will also see the PaloadRestriction. in this case we restrict the read permissions to documents that only have
a certain value for the Topic Key. We could just use a fixed value like "Food" here, but we can also use a placeholder. We will
describe the placeholder in more detail in the Section of RoleAssignments later but for now just think that this value can differ from user
to user later. You can also use nested QueryRestrictions or basically any Query you know from MongoDB

#### PayloadRestriction
The PayloadRestriction is only available for Permissions of the Right "create" and "update". "update" contains a QueryRestriction additionally,
"read" and "delete" only contain QueryRestrictions. The purpose of the PayloadRestriction is to restrict the payload a user can send. If we
take our current example let's say the user was only able to create Blogposts in his favorite category. So the create Permssion would
look like this

```json
{
  "Title": "createFavoriteBlogPosts",
  "Collection": "blogposts",
  "Right": "create",
  "PayloadRestriction" : {
    "Topic" : "${FavoriteTopic}"
  }
}
```

You see the actual structure of the PayloadRestriction is basically the same as the query restriction. The takeaway is that the QueryRestriction
restricts everything you get from the database. The PayloadRestriction restricts everything you put into the database. That is why the "update"
right needs both the Payload and the QueryRestriction. As you first have to determine if you are allowed to get the document you want to change
as well as validate the information you want to put into the document.

### Roles

Roles are used to aggregate permissions to a certain role. In our current example a role could look like this

```json
{
  "Title": "DefaultUser",
  "Permissions": [
    "readFavoriteBlogPosts",
    "deleteOwnBlogPosts",
    "updataOwnBlogPosts",
    "createBlogPostsInFavoriteCategory"
  ]
}
```

#### Title
The Title is also used to identify the Role and to use it in the RoleAssignments

#### Permissions
An Array with all the Permissions you want to grant with that role. The entries are the titles of those Permissions, not their _id

### RoleAssignments
Finally we want to assign those roles to users. A role assignment for the given example could look like this

```json
{
  "User": "john.doe@hotmail.com",
  "Role": "DefaultUser",
  "Data": {
    "FavoriteTopic": "Cars"
  }
}
```

You can assign as many roles to a user as you want to, but every Role Assignment will only contain a single role. So if you want to do that create multiple
role assignments each containing exactly one Role.

#### User
The Identification of the user. The Authenticator will send back user information. In the section Environment Variables you can see how to set which of those parameters
you want to use as identification. By default it is the _id of the user but in this case we went with email for a better understanding. There are also special users you can assign. 

*$anyone*: will be a RoleAssignment that is valid for anyonone making a web request. Even if that person is not authenticated (If you manually set [AUTHENTICATOR_REJECT_WITHOUT_COOKIE](#authenticator_reject_without_cookie) to true this will have no effect as Requests of unauthenticated users will 
immediately be rejected).

*$authenticated*: is the special user that makes this role assignment valid for any user that has been authenticated by the Authenticator and whose
user object contains a value for the user primary identification key (see the correspoding part in the environment variables about [QBOUNCER_USER_PRIMARY_KEY](#qbouncer_user_primary_key) for more information)

#### Role
The Role you want to assign. It has to be exaclty one role you assign. In this case its the DefaultUser Role we created in the previous section. If John Doe was also
an admin we could also create a second Role Assignment with that role and he would have all the permissions granted by those two roles

#### Data
Remember the Placeholder for the QueryRestriction we used in the Permission Section. Now we can set this individually for our John Doe. So in in this case when John Doe
later tries to access all BlogPosts from the Database the Authenticator will adjust the Query to only return BlogPosts from the Topic Cars. Just make sure that all the 
Placeholders used in any permissions the user has also need to have Data in here.

## Configuration

Several things can and need to be configured for the Query Bouncer to run properly. Those will contain Settings for the Authenticator, the Web Server, Main Settings and the
MongoDB you are using to store all the Permissions, RoleAssignments, etc. The following instructions will be the environment variables you use to configure the Query Bouncer

### Main

#### QBOUNCER_USER_PRIMARY_KEY
As mentioned earlier, the Query Bouncer will send you back a user object containing multiple key/value-pairs. By default The Query Bouncer will use the _id of a user as a
unique identifier, but you can also use email for example

#### QBOUNCER_ADMIN_TOKEN
The Admin Token will be used to access the Query Bouncer without restrictions. Only Admins will be able to set Roles and Permissions, but RoleAssignments will also be available
users with according rights

### Authenticator
The Query Bouncer is pretty tightly paired with the Authenticator. The Authenticator will handle session management and determine who is using your application and the Query Bouncer
will determine what the user is allowed to do and what not.

#### AUTHENTICATOR_HOST
The Host where the Query Bouncer will be able to reach the Authenticator. Defaults to http://localhost:8081 if you are hosting it on your machine as well for testing purposes

### AUTHENTICATOR_REJECT_WITHOUT_COOKIE
You can set if you want users that are not sending a cookie will be rejected immediately by the Query Bouncer. This will cause that only authenticated users will be able to use
the API at all. Defaults to false

### Express

#### HTTP_PORT
Port you want to use for the main API: Defaults to 8080

#### HTTP_METRICS_PORT
Port you Metrics will be available. Those can be scraped by Prometheus (still a work in progress and not ready). Defaults to 9100

### MongoDB

#### MONGODB_HOST
Host of the MongoDB. Defaults to localhost
#### MONGODB_PORT
Port of the MongoDB. Defaults to 27017
#### MONGODB_DATABASE
Database where Authenticator stores its Data. Defaults to query_bouncer
#### MONGODB_AUTHDB
Database you will authenticate your user against. Defaults to admin
#### MONGDB_USERNAME
Username for MongoDB
#### MONGODB_PASSWORD
Password for your user


## API

### Create New Permission
Create a new Permission. See [Permissions](#Permissions) for details.

**URL:**    
`/api/admin/permissions`   
`/api/admin/internalPermissions`   
**Method:** POST   
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if InternalRoleAssignment present)  
**Request Body Example**  

```json
{  
  "Title": "ReadBlogPosts",
  "Collection": "blogposts",
  "Right": "read",  
  "PayloadRestriction": {
    "Category": "${Category}"
  }
}
```  

#### Success Response
**Code:** 201    


**Response Data Example**
```json
{  
  "Title": "ReadBlogPosts",
  "Collection": "blogposts",
  "Right": "read",  
  "PayloadRestriction": {
    "Category": "${Category}"
  }
}
```


### Get Current Permissions
Get all Permissions currently available. If you have not already specified a Permission Role and InternalRoleAssignment for your user make sure you use the bearer token to authenticate

**URL:**   
`/api/admin/permissions`   
`/api/admin/internalPermissions`
**Method:** GET   
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if proper RoleAssignment present) 

#### Success Response
**Code:** 200   
**Content Example**   

```json
[{
  "_id": "5b637ee00000000000000000",
  "Title": "ReadBlogPosts",
  "Collection": "blogposts",
  "Right": "read",
  "QueryRestriction" : {},
  "PayloadRestriction": {}
}]
```

### Update Existing Permission
Update an existing Permission. See [Permissions](#Permissions) for details.

**URL:** 
`/api/admin/permissions/:PermissionTitle`   
`/api/admin/internalPermissions/:PermissionTitle`   
**Method:** PUT   
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if proper RoleAssignment present) 
**Request Body Example**   

```json
{  
  "Title": "ReadBlogPosts",
  "Collection": "blogposts",
  "Right": "read",  
  "PayloadRestriction": {
    "Category": "${Category}"
  }
}
```

#### Success Response
**Code:** 200      
**Response Data Example**
```json
{  
  "Title": "ReadBlogPosts",
  "Collection": "blogposts",
  "Right": "read",  
  "PayloadRestriction": {
    "Category": "${Category}"
  }
}
```

### Delete Permission
Delete a Permission

**URL:**    
`/api/admin/permissions/:PermissionTitle`  
(`/api/admin/internalPermissions/:PermissionTitle`)   
**Method:** DELETE   
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if proper RoleAssignment present)    

#### Success Response
**Code:** 200      
**Request Body Example**  

```json
{  
  "Title": "ReadBlogPosts",
  "Collection": "blogposts",
  "Right": "read",  
  "PayloadRestriction": {
    "Category": "${Category}"
  }
}
```

### Create Role
Create a new Role

**URL:** `/api/admin/roles` 
**Method:** POST   
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if proper RoleAssignment present)  

**Request Body Example**   

```json
{ 
  "Title": "FoodBlogger",
  "Permissions": [
    "ReadBlogPosts",
    "CreateFoodBlogPosts"
  ]
}
```

#### Success Response
**Code:** 201      
**Success Response Body Example**  

```json
{ 
  "_id": "5b637ee00000000000000000",
  "Title": "FoodBlogger",
  "Permissions": [
    "ReadBlogPosts",
    "CreateFoodBlogPosts"
  ]
}
```

### Get current Roles
Get Roles currently available

**URL:** `/api/admin/roles`     
**Method:** GET    
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if InternalRoleAssignment present)   

#### Success Response
**Code:** 200      
**Success Response Body Example**  

```json
[{
  "_id": "5b637ee00000000000000000",   
  "Title": "FoodBlogger",
  "Permissions": [
    "ReadBlogPosts",
    "CreateFoodBlogPosts"
  ]
}]
```

### Update existing Role Role
Update an existing Role

**URL:** `/api/admin/roles/:RoleTitle`      
**Method:** PUT    
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if InternalRoleAssignment present)   
**Request Body Example**  

```json
{  
  "Title": "FoodBlogger",
  "Permissions": [
    "ReadBlogPosts",
    "CreateFoodBlogPosts",
    "DeleteOwnPosts"
  ]
}
```

#### Success Response
**Code:** 200      
**Success Response Body Example**   
**Request Body Example**  

```json
{
  "_id": "5b637ee00000000000000000",   
  "Title": "FoodBlogger",
  "Permissions": [
    "ReadBlogPosts",
    "CreateFoodBlogPosts",
    "DeleteOwnPosts"
  ]
}
```

#### Delete Role
Delete an existing Role

**URL:** `/api/admin/roles/:RoleTitle`   
**Method:** DELETE    
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if InternalRoleAssignment present)   
**Request Body Example**  


#### Success Response
**Code:** 200      
**Success Response Body Example**   
**Request Body Example**  

```json
{
  "_id": "5b637ee00000000000000000",   
  "Title": "FoodBlogger",
  "Permissions": [
    "ReadBlogPosts",
    "CreateFoodBlogPosts",
    "DeleteOwnPosts"
  ]
}
```


### Create Role Assignment
Create a new RoleAssignment. Keep in mind that user has to match the [userPrimaryKey](#QBOUNCER_USER_PRIMARY_KEY) described in the Configuration Chapter. In this case we assume that it is the E-Mail.

**URL:** `/api/admin/roleAssignments`
**Method:** POST   
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if InternalRoleAssignment present) 
**Request Body Example**  

```json
{  
  "User": "john.doe@hotmail.com",
  "Role": "FoodBlogger",
  "Data": {
    "FavoriteTopic": "Food"
  }
}
```  

#### Success Response
**Code:** 201   
**Success Response Body Example**  

```json
{  
  "_id": "5b637ee00000000000000000",   
  "User": "john.doe@hotmail.com",
  "Role": "FoodBlogger",
  "Data": {
    "FavoriteTopic": "Food"
  }
}
```

### Get Current Role Assignments
Get all current Role Assignments
**URL:** `/api/admin/roleAssignments`
**Method:** GET   
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if InternalRoleAssignment present) 

#### Success Response
**Code:** 200  
**Success Response Body Example**  

```json
[{  
  "_id": "5b637ee00000000000000000",   
  "User": "john.doe@hotmail.com",
  "Role": "FoodBlogger",
  "Data": {
    "FavoriteTopic": "Food"
  }
}]
```
#### Update Role Assignment
Update an existing Role Assignment
**URL:** `/api/admin/roleAssignments/:Id`
**Method:** PUT    
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if InternalRoleAssignment present) 
**Request Body Example**  

```json
{  
  "User": "john.doe@hotmail.com",
  "Role": "FoodBlogger",
  "Data": {
    "FavoriteTopic": "Cars"
  }
}
```  

#### Success Response
**Code:** 200   
**Success Response Body Example**  

```json
{  
  "_id": "5b637ee00000000000000000",   
  "User": "john.doe@hotmail.com",
  "Role": "FoodBlogger",
  "Data": {
    "FavoriteTopic": "Cars"
  }
}
```

#### Delete Role Assignment
Delete an existing Role Assignment
**URL:** `/api/admin/roleAssignments/:Id`
**Method:** DELETE       
**Auth required:** YES   
**Auth Type:** Bearer Token (Cookie if InternalRoleAssignment present) 

#### Success Response
**Code:** 200   
**Success Response Body Example**  

```json
{  
  "_id": "5b637ee00000000000000000",   
  "User": "john.doe@hotmail.com",
  "Role": "FoodBlogger",
  "Data": {
    "FavoriteTopic": "Cars"
  }
}
```


# To Do's

There's more work to do. The most recent additions will be

- UI for managing Rights and Roles (separate Repo)
- Support of MongoDBs Field Projection (which will enable Permissions to go down on Sub-Document level)