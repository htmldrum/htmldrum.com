---
layout: post 
title: Nested Query Sets and Elasticsearch
categories: javascript elasticsearch sql json
summary: Don't let controller spaghetti hold you back from parsing nested query sets from html input vectors
---
When passing variables to Elasticsearch, you have to honour its syntax. It demands that nested queries are placed within syntactical blocks. However, when you take input from a user, it is generally *not* nested but from a vector of input fields. How then are you to map from a HTML vector to a JSON query hierarchy? In this post, I'll walk you through how to map from a vector of HTML input fields to a query object.
The View
--------
It all starts with the HTML. Somewhere in a table will lurk HTML like this.
{% highlight html %}<thead>
  <tr>
    <th><input class="filter" id="name" value="<%= filter_text['name'] || ''%>" placeholder="Flight Name"></th>
    <th><input class="filter" id="taster_name" value="<%= filter_text['taster_name'] || ''%>" placeholder="Taster Name"></th>
    <th><input class="filter" id="flight_date" value="<%= filter_text['flight_date'] || ''%>" placeholder="Flight Date"></th>
    <th><input class="filter" id="created_at" value="<%= filter_text['created_at'] || ''%>" placeholder="Last Modified"></th>
    <th><input class="filter" id="updated_at" value="<%= filter_text['updated_at'] || ''%>" placeholder="Last Updated"></th>
    <th><input class="filter" id="assignee_name" value="<%= filter_text['assignee_name'] || ''%>" placeholder="Assignee Name"></th>
    <th><input class="filter" id="editorial_status_title" value="<%= filter_text['editorial_status_title'] || ''%>" placeholder="Status"></th>
  </tr>
</thead>{% endhighlight %}

This HTML represents a query against a record of a wine tasting. It has a name, a taster, a date, timestamps and editorial information. Somewhere in your view you will periodically get and set the values of the fields depending on business logic. However, we do not represent the object like this in Elasticsearch or in the DB. Here it is de-normalized.

The Model
--------

We prepare the index record using this DB query
{% highlight sql %}
      "SELECT to_json(t) FROM (
        SELECT a.id,
               a.name,
               a.description,
               a.taster_id,
               a.flight_date,
               a.assigned_to,
               a.wine_list_id,
               a.published,
               a.publication_date,
               a.editorial_status,
               a.created_at,
               a.updated_at,
               (
                SELECT b.id,
                       b.name,
                       b.website,
                       b.address,
                       b.address2,
                       b.city,
                       b.state,
                       b.zip,
                       b.country,
                       b.phone,
                       b.created_at,
                       b.updated_at,
                       b.email,
                       b.fax,
                       b.winery_id
                  FROM locations b
                  WHERE b.id = a.location_id
               ) as location,
               (
                SELECT b.id,
                       b.email,
                       b.name,
                       b.initials,
                  FROM users b
                  WHERE b.id = a.taster_id
               ) as taster,
               (
                SELECT b.id,
                       b.email,
                       b.name,
                       b.initials,
                  FROM users b
                  WHERE b.id = a.assignee_id
               ) as assignee,
               (
                SELECT b.id,
                       b.name,
                  FROM editorial_statuses b
                  WHERE b.id = a.editorial_status
               ) as editorial_status
        FROM flights a
        WHERE a.id in ('#{ids.join( '\', \'' )}')) t"{% endhighlight %}

With schema defined by this Elasticsearch object

{% highlight json %}{
  settings: {
    index: {
      number_of_shards: 1
    },
    analysis: {
      filter: {
        autocomplete_filter: {
          type: "edge_ngram",
          min_gram: 1,
          max_gram: 20
        }
      },
      analyzer: {
        autocomplete: {
          type: "custom",
          tokenizer: "standard",
          filter: [ "lowercase", "asciifolding", "autocomplete_filter" ]
        }
      }
    }
  },
  mappings: {
    flight: {
      properties: {
        created_at: {
          type: "date",
          format: "date_time_no_millis"
        },
        updated_at: {
          type: "date",
          format: "date_time_no_millis"
        },
        name: {
          type: "string",
          index: "analyzed",
          _analyzer: "autocomplete",
          search_analyzer: "standard" 
        },
        description: {
          type: "string",
          index: "not_analyzed"
        },
        flight_date: {
          type: "date",
          format: "yyyy-MM-dd",
        },
        location: {
          type: "nested",
          properties: {
            name: {
              type: "string",
              index: "analyzed",
              index_analyzer: "autocomplete",
              search_analyzer: "standard",
            }
          }
        },
        taster: {
          type: "nested",
          properties: {
            name: {
              type: "string",
              index: "analyzed",
              index_analyzer: "autocomplete",
              search_analyzer: "standard",
            }
          }
        },
        assignee: {
          type: "nested",
          properties: {
            name: {
              type: "string",
              index: "analyzed",
              index_analyzer: "autocomplete",
              search_analyzer: "standard",
            }
          }
        },
        editorial_status: {
          type: "nested",
          properties: {
            title: {
              type: "string",
              index: "analyzed",
              index_analyzer: "autocomplete",
              search_analyzer: "standard",
            },
            code: {
              type: "integer"
            }
          }
        }
      }
    }
  }
}{% endhighlight %}

As you can see, it's not going to be easy to query over the assignee, taster or editorial status as these are nested objects themselves, requiring syntactical mark-up in the JSON query issued to the Elasticsearch query engine.

To manage this mapping we generate a query hierarchy: just an object that's marked up with the correctly nested values.

{% highlight javascript %}     
var qh = {
  created_at: [],
  updated_at: [],
  name: [],
  flight_date: [],
  assignee: {
    name: []
  },
  taster: {
    name: []
  },
  editorial_status: {
    title: []
  }
};
{% endhighlight %}

The Controller
--------
Somewhere in your controller you'll have an event listener waiting for the user to issue the query. When this handler is triggered, you'll itterate over the values in the filter fields of the input fields and generate a nested query object for the Elasticsearch query engine. Your code may look a little something like this (`_` is just a reference to a fn library like [Lodash] or [Underscore.js]):

{% highlight javascript %}     
_.each(this.filters, function(f){

  var fid = f[0].toString();
  var v = ANDSL.parse( this.state.filter_text[ fid ] );

  if( !_.isUndefined( v.type ) ){

    switch( fid ){
      case 'name':
        switch( v.type ){
          case 'term':
            qh.name.push({ "match": { "flight.name": v.value.toString() }});
            break;
          case 'range':
            null;
            break;
          case 'multi_term':
            _.each( v.value, function( t ){
              qh.name.push({ "match": { "flight.name": t.toString() }});
            });
            break;
          default:
            throw "Unhandled Exception";
        }
        break;
    }
  }
});
{% endhighlight %}

For each filter, parse the text in the input field (user may enter syntactical sugar to conduct different queries in ES), then add the query type to the query hierarchy.

For nested queries, you need to resolve the edge node of the tree like this

{% highlight javascript %}case 'assignee_name':
  switch( v.type ){
    case 'term':
      qh.assignee.name.push({ "match": { "assignee.name": v.value.toString() }});
      break;
    case 'range':
      null;
      break;
    case 'multi_term':
      _.each( v.value, function( t ){
        qh.assignee.name.push({ "match": { "assignee.name": t.toString() }});
      });
      break;
    default:
      throw "Unhandled Exception";
  }
  break;
default:
  throw "Unhandled Exception";
  break;{% endhighlight %}
Now, with a completed query hierarchy we pass it to this library function which recurses the query hierarchy and correctly returns the Elasticsearch JSON.
 
{% highlight javascript %}return MSES.parse(qh);{% endhighlight %}

Looking a little something like this. I immitate variadric function invocation in Erlang.

{% highlight javascript %}
   (function(){ 
   define([ 'underscore' ], function( _ ){

    var MSES = {
		  
    // Generic function to encode a QueryHierarchy to an ES JSON query
    // Recursive, Erlang style
		  
    // qh ->
    parse: function( obj ){ // parse/1
		  
      var tmp = undefined;
      var ES;
		  
      if( this._is_obj( obj ) ){
		  
        tmp = this._parse( obj, undefined );
		  
        if( tmp.length ) {
          
          ES = {
            body: {
              query: {
                bool: {
                  must: tmp.slice( 0 )
                }
              }
            }
          };
          
        } else {
		  
          ES = undefined;
		  
        }
		  
      } else {
		  
        throw "Unhandled Exception";
		  
      }
		  
      return ES;
		  
    },
    _parse: function( o, path ){ // parse/2
		  
      if( this._is_obj( o ) ){
		  
        var q = [];
        var tmp;
        var tmp_path;
		  
        _.each( o, function( v, k, l ){
		  
          if( this._is_arr( v ) ){
		  
            if( v.length ){
              q = q.concat( v );
            }
		  
          } else if( this._is_obj( v ) ) {
		  
            if( _.isUndefined( path ) ){
              tmp_path = k.toString(); //accolades
            } else {
              tmp_path = path + '.' + k.toString();
            }
		  
            tmp = this._parse( v, tmp_path );
		  
            if( tmp.length ){
              q.push({
                nested: {
                  path: tmp_path.toString(),
                  query: {
                    bool: {
                      must: tmp.slice(0)
                    }
                  }
                }
              });
            }
		  
          } else {
		  
            throw "Unhandled Exception: Can only parse objects and arrays";
          }
		  
        }.bind( this ));
		  
        return q.slice( 0 ); // Return copy of array
		  
      } else if( this._is_arr( o ) ) {
		  
        return o.slice( 0 ); // Return copy of array
		  
      } else {
		  
        throw "Unhandled Exception: Can only parse objects and arrays";
      }
      
    },
		  
    // Arrays *are* ojects, I just want the set diff
    _is_arr: function( c ){
      return ( _.isObject( c ) && _.isArray( c ) );
    },
    _is_obj: function( c ){
      return ( _.isObject( c ) && !_.isArray( c ) );
    },
		  
  };
		  
  return MSES;
		  
  });
}());
{% endhighlight %}

Now you don't need to create back-end controllers to parse ES queries, you can do it all client side. For more information, check out [these gists](https://gist.github.com/htmldrum/7d889073bb5ad3d9f79a).

**Update 6/26/2016:** Added syntax highlighting

[Underscore.js]: "http://underscorejs.org"
[Lodash]: "http://lodash.com"