---
layout: post 
title: Top-down, depth-first tree parser in JS
categories: tree-parser D3
summary: Tree building in D3
---
The easiest way to solve a problem was to construct a tree and implement a visitor pattern for building a representation of geographical wine regions. Hierarchies of regions formed an acyclic graph but it was locked behind a linear CRUD API. [This script](https://gist.github.com/htmldrum/6450c32f622f8d3a6da8) reconstructs the tree for graphing in D3.

Here's your first warning: *CRUD will lock your data behind sparse, inefficient interfaces* designed ostensibly to indicate progress and http cacheing. Do not fall into the trap of linearly scaling routes to describe your domain. This is lazy and results in a proliferation of 'names'. **CQRS!**

```javascript

  // Nodes in tree can have children which are Nodes
  var Node = function( val_obj ){

    if( val_obj ){

      [ 'crumb_path', 'crumbs', 'description', 'full_path', 'id', 'modified_at', 'name', 'parent', 'region_id' ].forEach( function( token, ndx ){
        switch( token ){
          case 'crumb_path':
          case 'full_path':
            this[ token ] = val_obj.item[ token ];
            break;
          default:
            this[ token ] = val_obj.item[ token ];
            break;
        }
      }.bind( this ));

    }

    this.children = undefined;
    this.visited = false;

  }

  Node.prototype.get_next_unvisited_node = function(){

    var i;

    if( !this.visited ){
      return this;
    }
    else if( typeof this.children === 'undefined' ){

      return undefined;

    } else {
      
      for( i=0; i < this.children.length; i++ ){
        if( this.children[i].get_next_unvisited_node() ){
          return this.children[i].get_next_unvisited_node();
        }
      }
      return undefined;

    }
  }

  Node.prototype.visit = function( node_to_visit, tree ){

    var indexes_to_trim = [];
    var client = ( node_to_visit.region_id == this.region_id ) ? this : node_to_visit;

    tree.forEach( function( node, ndx ){

      if( node.item.parent && node.item.parent.region_id && node.item.parent.region_id === this.id ){

        if( typeof this.children === 'undefined' ){
          this.children = [];
          this.children.push( new Node( node ) );
        }
        else {
          this.children.push( new Node( node ) );
        }
        indexes_to_trim.push( ndx );
        
      }
      
    }.bind( client ));

    indexes_to_trim.forEach( function( ndx ){
      tree = tree.slice( 0, ndx ).concat( tree.slice( ( ndx + 1 ), tree.length ) )
    });
    client.visited = true;

  }

  function parse_response_to_tree( response ){

    var tree, root, node;
    var root_data = parse_response( response );
    tree = root_data.tree
    root = root_data.root

    root.visit( root, tree );

    while( node = root.get_next_unvisited_node() ){
      root.visit( node, tree );
    }

    return root;

  }

  function parse_response( response ){

    var root;
    var i;
    var predicate = function( node ){

      if( node.item.name === 'Earth' ){
        return node;
      }
      else {
        return undefined;
      }
      
    }

    for( i=0; i < response.list.length && !root; i++ ){
      root = predicate( response.list[i] );
    }

    return ( root ) 
      ? { root: new Node( root ), tree: response.list.slice( 0,i ).concat( response.list.slice( ( i + 1 ), response.list.length )) } 
      : { root: undefined, response: undefined };

  }

  // D3 code
  d3.json("/data/regions.json", function( error, data ) {
    var tree = parse_response_to_tree( data );
    console.log( 'tree', tree );
  });
```

**Update 6/26/2016**: Added preface and rant on CRUD.
