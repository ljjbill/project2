#################################################
# IMPORT DEPENDENCIES FOR FLASK
#################################################
from flask import (
   Flask,
   render_template,
   jsonify,
   redirect,
   make_response,
   request)
from flask_cors import CORS

#################################################
# IMPORT DEPENDENCIES TO ACCESS DB THROUGH SQLALCHEMY FOR DATA INGRESS
#################################################
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import (
   create_engine,
   func,
   inspect,
   extract)

from flask_sqlalchemy import SQLAlchemy

#################################################
# IMPORT DEPENDENCIES FOR OTHER CODE WITHIN ROUTES
#################################################
from pandas.util import hash_pandas_object
import pandas as pd
import json
import requests
import datetime
from datetime import timedelta

#################################################
# Flask Setup
#################################################
app = Flask (__name__)
CORS(app)

# Database connection
app.config['SQLALCHEMY_DATABASE_URI'] =  "sqlite:///database/db.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
#reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
"""study = Base.classes.study""" # EXAMPLE

# creates a route for the flask front end
@app.route('/')
def home():
   """Return the homepage"""
   return render_template('index.html')



@app.route('/api/pie_chart', methods=['GET'])
def get_medals_percent():
   """Returns Country list with medals percent of all time"""
   athlete_events = Base.classes.athlete_events
   noc_regions = Base.classes.noc

   sel = [
    noc_regions.region,
    athlete_events.Medal
   ]

   query = db.session.query(*sel)\
         .filter(athlete_events.NOC == noc_regions.NOC)\
         .filter(athlete_events.Season == 'Summer')\
         .filter(athlete_events.Medal.isnot(None))\
         .all()

   df = pd.DataFrame(query)

   df = df.groupby(['region'])

   table = df["Medal"].count().reset_index()
   Total = table['Medal'].sum()

   table['measure'] = round((table['Medal'] / Total), 10)

   name_dict = {
      'region': 'country'
   }

   column_list = [
      'country',
      'measure'
   ]

   table = table.rename(columns=name_dict)
   table = table[table.columns.intersection(column_list)]

   table = table.sort_values(by=['measure'], ascending=False)

   data = table.to_json(orient='records')
   return data



@app.route('/api/bar_chart', methods=['GET'])
def get_bar_chart():
   """Returns Bar Chart data for Countries' sports medals count"""
   athlete_events = Base.classes.athlete_events
   noc_regions = Base.classes.noc
   
   sel = [
    noc_regions.region,
    athlete_events.Sport,
    athlete_events.Medal
   ]

   query = db.session.query(*sel)\
         .filter(athlete_events.NOC == noc_regions.NOC)\
         .filter(athlete_events.Season == 'Summer')\
         .filter(athlete_events.Medal.isnot(None))\
         .all()

   df = pd.DataFrame(query)

   group = df.groupby(['region', 'Sport'])
   table = group["Medal"].count().reset_index()

   no_group = df.groupby(['Sport'])
   table_2 =  no_group['Medal'].count().reset_index()
   table_2['country'] = 'All'

   name_dict = {
      'region': 'country',
      'Medal': 'measure',
      'Sport': 'sports'
   }

   column_list = [
      'country',
      'sports',
      'measure'
   ]

   table = table.rename(columns=name_dict)
   table = table[table.columns.intersection(column_list)]
   table = table.sort_values(by=['measure'], ascending=False).reset_index(drop=True)

   table_2 = table_2.rename(columns=name_dict)
   table_2 = table_2[table_2.columns.intersection(column_list)]
   table_2 = table_2.sort_values(by=['measure'], ascending=False).reset_index(drop=True)

   result = pd.concat([table_2, table], ignore_index=True)
   result = result[['country', 'sports', 'measure']]

   data = result.to_json(orient='records')
   return data



@app.route('/api/line_chart', methods=['GET'])
def get_line_chart():
   """Returns line Chart data for Countries' sports medals count"""
   athlete_events = Base.classes.athlete_events
   noc_regions = Base.classes.noc

   sel = [
    noc_regions.region,
    athlete_events.Year,
    athlete_events.Medal
   ]

   query = db.session.query(*sel)\
         .filter(athlete_events.NOC == noc_regions.NOC)\
         .filter(athlete_events.Season == 'Summer')\
         .filter(athlete_events.Medal.isnot(None))\
         .all()

   df = pd.DataFrame(query)

   group = df.groupby(['region', 'Year'])
   table = group["Medal"].count().reset_index()

   no_group = df.groupby(['Year'])
   table_2 =  no_group['Medal'].count().reset_index()
   table_2['country'] = 'All'

   name_dict = {
      'region': 'country',
      'Medal': 'measure',
      'Year': 'year'
   }

   column_list = [
      'country',
      'year',
      'measure'
   ]

   table = table.rename(columns=name_dict)
   table = table[table.columns.intersection(column_list)]
   table = table.sort_values(by=['country', 'year'], ascending=True).reset_index(drop=True)

   table_2 = table_2.rename(columns=name_dict)
   table_2 = table_2[table_2.columns.intersection(column_list)]
   table_2 = table_2.sort_values(by=['country', 'year'], ascending=True).reset_index(drop=True)

   result = pd.concat([table_2, table], ignore_index=True)
   result = result[['country', 'year', 'measure']]

   data = result.to_json(orient='records')
   return data



@app.route('/api/scatter_plot', methods=['GET'])
def get_scatter_plot():
   """Returns scatter plot data"""
   athlete_events = Base.classes.athlete_events
   noc_regions = Base.classes.noc

   sel = [
    noc_regions.region,
    athlete_events.Year,
    athlete_events.Season,
    athlete_events.Sport,
    athlete_events.Medal
   ]

   query = db.session.query(*sel)\
         .filter(athlete_events.NOC == noc_regions.NOC)\
         .all()

   df = pd.DataFrame(query)
   group = df.groupby(['Year', 'Season', 'Sport'])

   table = group["Medal"].count().reset_index()

   name_dict = {
      'Medal': 'Noathelete',
      'Sport': 'Sports'
   }

   column_list = [
      'Year',
      'Season',
      'Sports',
      'Noathelete'
   ]

   table = table.rename(columns=name_dict)
   table = table[table.columns.intersection(column_list)]

   data = table.to_json(orient='records')
   return data



@app.route('/api/dashboard', methods=['GET'])
def get_dashbord_data():
   """Returns dashboard data"""
   athlete_events = Base.classes.athlete_events
   noc_regions = Base.classes.noc
   
   sel = [
      athlete_events.NOC,
      athlete_events.Medal
      ]
      

   query = db.session.query(*sel)\
         .filter(athlete_events.Medal.isnot(None))\
         .all()

   df = pd.DataFrame(query)
   group = df.groupby(['NOC'])

   table = group["Medal"].value_counts().unstack(fill_value=0)
   table = table[['Gold', 'Silver', 'Bronze']]
   data = []

   dict_a = table.T.to_dict()
   for country, values in dict_a.items():
      obj = {}
      obj['country'] = country
      obj['freq'] = {'Bronze':dict_a[country]['Bronze'], 'Silver':dict_a[country]['Silver'], 'Gold':dict_a[country]['Gold']}
      data.append(obj)

   return jsonify(data)


if __name__ == "__main__":
    app.run(debug = True)