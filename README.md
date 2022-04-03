# DynamicTables
Application to Manage Dynamic Models 

# Purpose
There was a need to allow end users Create and Update their own tables within an applications for the purpose of managing risk types.

# Implementation
Various field types are implemeneted following the django model design e.g CharField, DateField, IntegerField, DecimalField etc. 
Enums are also implemented following the django design.
The difference on Enums is that the choices string option for enums is delimited by both "|" and ";" at the frontend. 
However it is converted to django format of "," at the backend.
e.g. for a table name Aerospace, the field names, types and options are as follows

Table:- Aerospace
1.) Field: Name, Type: CharField, Options: blank=false,max_length=50,null=false
2.) Field: Foreign, Type: CharField, Options: choices=(('True'|'True');('False'|'False')),default=True

Deployment
Backend was deployed to phythoneverywhere
Frontend was deployed to netlify
