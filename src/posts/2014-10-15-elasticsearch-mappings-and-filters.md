---
layout : post 
title: Elasticsearch Mappings and Filters
categories: elasticsearch json ruby rails
summary: Elasticsearch mappings can be cryptic at the best of times.
---
I recently had to define Elasticsearch mappings for all the entities in an API after stakeholders came back saying they wanted more user-friendly search behaviour. The following is a mapping that implements autocomplete behavior and nested property resolution.

Notes:

- `number_of_shards`: 1. Usually you split your result sets across numerous shards. However, as you add more shards, results take longer to prepare and become more difficult to query.
- Analysis. In this stanza we define the query filters and analyzers that implement autocomplete behaviour. Analysis is performed when results are input to Elasticsearch. Shards will store ngram character trees of between 1 and 20 in length. It is important in the analysis stanza to specify a normalization scheme ( lower case, matching non-ascii characters to ascii characters ) so searches for 'manana' map to results for 'mañana'.
- Mappings. Finally the meat of the index. Indexes map closely to models. They can have attributes and foreign keys. In this case, foreign key constraints are maintained in the DB (more later) but mapped to the index on index creation/updates. Properties such as 'location' are backed by their own models but mapped to the indexed entity as a cacheing mechanism.


```json
{
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
          filter: ["lowercase", "asciifolding", "autocomplete_filter"]
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
          index_analyzer: "autocomplete",
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
}
```

Various modifiers are used to prevent Elasticsearch from analyzing long fields (description). Format specifiers are given to aid Elasticsearch's treatment of timestamp and int searches and nested properties allow nested queries.

I mentioned before that constraints are maintained in the DB. Elasticsearch (as much as it tries to spruke itself as a complete solution) is not appropriate as a non-volatile datastore. It will not maintain ACID constraints and is not as useful in querying objects as relational DB's. As an aside, here's the SQL for preparing this index (uses psql extensions in a rails context)

```sql
SELECT to_json(t) FROM (
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
   WHERE a.id in ('#{ids.join( '\', \'' )}')) t"
   ```

Keeping this query in SQL (and not relying on ActiveRecord relations) allows background workers to cache intermediate results and keep the load off rails - which, as much as I love it, is slow.
