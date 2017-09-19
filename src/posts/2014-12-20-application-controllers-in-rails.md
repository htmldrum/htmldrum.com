---
layout : post 
title: API Application controllers in Rails
categories: ruby  rails
summary: Correctly specifying inheritence semantics in Rails can save you time when defining controller behaviours.
---
The main benefit of Ruby is its role as a scripting C++. By this, I mean that it has all the fluidity of a scripting language (garbage collection, script execution, syntactical sugar, mixins, single inheritence) with familiar features of systems languages (class semantics and namespaces largely). When developing API's it's important to define a clear hierarchy of controllers and to try and place as much common functionality in parent classes or mixins. I came across [rails-api](https://github.com/rails-api/rails-api) a while ago but had issues with its performance and endless problems integrating it with standard rails gems (devise, will_paginate, acts_as_list, formtastic). However, it's approach was interesting so I rolled it out across a suite of API's.

The general inheritence behaviour is this:

    AppController < ApiController < ApplicationController < ActionController::Base

ApplicationController
---------------------
In the application controller I largely only place gem directives. The application controller represents the behaviour above `ActionController::Base` that is not specific to the API behaviour of the application.

{% highlight ruby %}
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  before_filter :update_sanitized_params, if: :devise_controller?

  def update_sanitized_params
    devise_parameter_sanitizer.for(:sign_up) {|u| u.permit(:name, :email, :password, :password_confirmation)}
  end

  protected

  # Overwriting the sign_out redirect path method
  def after_sign_in_path_for(resource_or_scope)
    users_path
  end
  def after_sign_out_path_for(resource_or_scope)
    users_path
  end
end
{% endhighlight %}

APIController
-------------
The API controller represents the behaviour that is specific to the API behaviour of a specific application. However, as API's are *versioned* we need to correctly namespace each APIController for each API version.

{% highlight ruby %}
#app/controllers/api/v1/api_controller.rb*
module Api
  module V1
    class ApiController < ApplicationController
      include QueryableController
      include BaseController

      def create
        a = controller_name.classify.constantize.create!( create_params )
        params[:id] = a.id
        show
      end

      def index
        render_template({
          results: controller_name.classify.constantize.paginate( :page => params[:page], :per_page => Settings.page_size ),
          template: "api/v1/#{controller_name.classify.underscore.pluralize}/index.json.jbuilder"
        })
      end

      def update
        @result = controller_name.classify.constantize.find( params[:id] )
        @result.update_attributes!( update_params )
        show
      end

      def destroy
        controller_name.classify.constantize.find( params[:id] ).destroy!
        respond_to do |format|
          format.html { render 'api/v1/layouts/destroy.json.jbuilder', :status => @status, :content_type => 'application/json' }
          format.json { render 'api/v1/layouts/destroy.json.jbuilder', :status => @status, :content_type => 'application/json' }
        end
      end

      ## TODO: See if ||= is short-circuited
      ## TODO: Implement improved show method
      ## TODO: Implement across existing controllers
      def show
        m = controller_name.classify
        @result ||= m.constantize.find( params[:id] )
        render_template( :template => "api/v1/#{m.underscore.pluralize}/show.json.jbuilder" )
      end

      #def show
        #m = controller_name.classify
        #if @result == nil
          #@result = m.constantize.find( params[:id] )
        #end
        #render_template( :template => "api/v1/#{m.underscore.pluralize}/show.json.jbuilder" )
      #end

      protected

      def update_params
        params.require( :item ).permit( controller_name.classify.constantize.new.attributes.keys.reject{ |a| %w[ id created_at updated_at ].include? a } )
      end
      
      def create_params
        update_params
      end

    end
  end
end
{% endhighlight %}

In this example I've attempted to use as much of the generic elements of Rails as possible to limit the code footprint. Each child of APIController is assumed to be a resource (`rails g resource Foo`). As such, will be given default CRUD behaviour. Business logic can overwrite specific methods in subclasses. I've taken the generic programming facilities further to parameterize update_params and create_params that are passed to the controllers. In update_params I make assumptions about the structure of the model (it will have a UUID and timestamps). APIController also features concerns (`BaseController`, `QueryableController`).

BaseController
---------------------
{% highlight ruby %}
# app/controllers/concerns/base_controller.rb

module BaseController
  extend ActiveSupport::Concern

  included do
    before_action :cors_preflight_check
    before_action :attach_headers
    before_action :attach_base_template_params
    before_action :can_respond
    before_action :verify_api_key
    rescue_from ActiveRecord::RecordNotFound, :with => :not_found
    rescue_from ActionController::ParameterMissing, :with => :missing_params
    rescue_from ActionController::RoutingError, :with => :not_found
    rescue_from ActiveRecord::RecordNotUnique, :with => :conflicting_resource
    rescue_from ActiveRecord::RecordInvalid, :with => :conflicting_resource
    rescue_from ActiveRecord::Rollback, :with => :conflicting_resource
    rescue_from PG::Error, :with => :not_found
    protect_from_forgery with: :exception 
    before_filter :configure_permitted_parameters, if: :devise_controller?
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) { |u| u.permit( :email, :password, :password_confirmation, :name) }
    devise_parameter_sanitizer.for(:account_update) { |u| u.permit(:email, :password, :password_confirmation, :current_password, :name, :initials, :is_taster, :is_admin ) }
  end

  def options
    # Does not get routed to, intercepted by cors_preflight_check
  end

  protected

  # TODO: Move HTTP concern
  def defer_processing
    respond_to do |format|
      format.html { render '/api/v1/202.json.jbuilder', :status => 202, :content_type => 'application/json' }
      format.json { render '/api/v1/202.json.jbuilder', :status => 202, :content_type => 'application/json' }
    end
  end

  def not_correct_syntax
    respond_to do |format|
      format.html { render '/api/v1/400.json.jbuilder', :status => 400, :content_type => 'application/json' }
      format.json { render '/api/v1/400.json.jbuilder', :status => 400, :content_type => 'application/json' }
    end
  end

  def not_authorized
    respond_to do |format|
      format.html { render '/api/v1/401.json.jbuilder', :status => 401, :content_type => 'application/json' }
      format.json { render '/api/v1/401.json.jbuilder', :status => 401, :content_type => 'application/json' }
    end
  end

  def not_allowed
    respond_to do |format|
      format.html { render '/api/v1/403.json.jbuilder', :status => 403, :content_type => 'application/json' }
      format.json { render '/api/v1/403.json.jbuilder', :status => 403, :content_type => 'application/json' }
    end
  end

  def conflicting_resource( e )
    if e
      @errors = [e.to_s]
    end
    respond_to do |format|
      format.html { render '/api/v1/409.json.jbuilder', :status => 409, :content_type => 'application/json' }
      format.json { render '/api/v1/409.json.jbuilder', :status => 409, :content_type => 'application/json' }
    end
  end

  def not_found( e )
    if e
      @errors = [e.to_s]
    end
    respond_to do |format|
      format.html { render '/api/v1/404.json.jbuilder', :status => 404, :content_type => 'application/json' }
      format.json { render '/api/v1/404.json.jbuilder', :status => 404, :content_type => 'application/json' }
    end
  end

  def missing_params( err )
    @error = "Missing parameter: #{err.param}"
    respond_to do |format|
      format.html { render '/api/v1/422.json.jbuilder', :status => 422, :content_type => 'application/json' }
      format.json { render '/api/v1/422.json.jbuilder', :status => 422, :content_type => 'application/json' }
    end
  end

  def success_ok
    respond_to do |format|
      format.html { render '/api/v1/200.json.jbuilder', :status => 200, :content_type => 'application/json' }
      format.json { render '/api/v1/200.json.jbuilder', :status => 200, :content_type => 'application/json' }
    end
  end

  def render *args

    if request.method != 'OPTIONS'
      curr_cache = request.fullpath.to_s

      @base[:status][:message] = @message
      @base[:status][:code] = @status
      @base[:paging][:count] = @count
      @base[:paging][:per_page] = Settings.page_size
      @base[:paging][:curr_page] = ( params[:page].to_i || 0 )
      @base[:paging][:prev] = get_paging_prev( curr_cache )
      @base[:paging][:curr] = curr_cache
      @base[:paging][:next] = get_paging_next( curr_cache, @count, Settings.page_size )
      @base[:debug][:elapsed] = @elapsed
      @base[:debug][:api_key_check] = true
    end
    super

  end

  def render_template( conf )
    if conf[:results]
      @results = conf[:results]
    end
    @message = "success"
    @status = 200
    @count = ( conf[:results] ? conf[:results].length : 0 )
    @elapsed = "TODO"
    @version = Settings.version

    render conf[:template], :status => @status, :content_type => 'application/json'
  end

  ## TODO: Move to queryable controller
  def render_query( conf )
    self.es_request( conf )
    respond_to do |format|
      format.html { render conf[:template], :status => @status, :content_type => 'application/json' }
      format.json { render conf[:template], :status => @status, :content_type => 'application/json' }
    end
  end

  def render_results( conf )
    respond_to do |format|
      format.html { render conf[:template], :status => @status, :content_type => 'application/json' }
      format.json { render conf[:template], :status => @status, :content_type => 'application/json' }
    end
  end

  ## TODO: Move to queryable controller
  def es_request( conf )
    conn = Elasticsearch::Client.new log:false
    case conf[:query_type]
      when /mget/i
        results = conn.mget \
                    index: conf[:index],
                    type: conf[:type],
                    body: conf[:body]
      when /suggest/i
        results = conn.suggest \
                    index: conf[:index],
                    body: conf[:body]
      when /search/i
        results = conn.search \
                    type: conf[:type],
                    index: conf[:index],
                    from: ( params[:page] ? params[:page].to_i * Rails.application.config.elasticsearch[ 'page_size' ] : 0 ),
                    size: Rails.application.config.elasticsearch[ 'page_size' ],
                    body: conf[:body]
      else
        results = conn.search \
                    type: conf[:type],
                    index: conf[:index],
                    from: ( params[:page] ? params[:page].to_i * Rails.application.config.elasticsearch[ 'page_size' ] : 0 ),
                    size: Rails.application.config.elasticsearch[ 'page_size' ],
                    body: conf[:body],
                    fields: conf[:fields]
    end
    @results = results['hits']['hits'].collect{ |r|
      if r['fields'] && r['fields']['partial']
        r['fields']['partial'][0]
      else
        r['_source']
      end
    }
    if( conf[:m404] && @results.length == 0 )
      @errors = [
        conf[:m404]
      ]
      not_found
      return
    end
    @message = "success"
    @status = 200
    @count = results['hits']['total']
    @elapsed = results['took']
    @version = Settings.version
    results
  end

  def es_query ( conf )
    conn = Elasticsearch::Client.new log:false
    conf[:from] ||= ( params[:page] ? params[:page].to_i * Rails.application.config.elasticsearch[ 'page_size' ] : 0 )
    conf[:size] ||= Rails.application.config.elasticsearch[ 'page_size' ]

    case conf[:query_type]
      when /search/i
        request = conn.search conf.except :query_type
        results = request['hits']['hits'].collect{ |r|
          if r['fields'] && r['fields']['partial']
            r['fields']['partial'][0]
          else
            r['_source']
          end
        }
      end
    { :results => results, :request => request }
  end


  def attach_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    headers['X-Powered-By'] = 'MShanken Communications'
  end

  def can_respond
    if ( request.content_type == nil || request.content_type.index( /application\/json/ ) == nil ) && ( request.method == 'PUT' || request.method == 'POST' || request.method == 'DELETE' ) # Prevent changes without correct header
      render :text => "Requests must contain application/json content_type header", :status => 403
    end
  end

  def verify_api_key
    #if request.method != 'OPTIONS'
      #u = request.headers['X-API-EMAIL']
      #u_m = User.find_by_email( u ) rescue nil
      #k = request.headers['X-API-KEY']

      #if u == nil || k == nil || u_m == nil || !u_m.valid_api_key?( k )
        #render :text => "Requests must be signed with corect X-API-EMAIL and X-API-KEY headers", :status => 403
      #end
    #end
  end

  # TODO: Move to pageable concern
  def get_paging_next( request_fullpath, count, page_size )
    if count == nil
      nil
    elsif request_fullpath.include? 'page' and ( count/page_size > ( params['page'].to_i ) )
      request_fullpath.gsub(/(?<=page=)\d+/){ |num| num.to_i + 1 }
    elsif !request_fullpath.include? 'page' and ( count/page_size > 0 )
      request_fullpath + '?page=1'
    else
      nil
    end
  end
  def get_paging_prev( request_fullpath )
    if params.has_key?('page') and params['page'].to_i > 0
      request_fullpath.gsub(/(?<=page=)\d+/){ |num| num.to_i - 1 }
    else
      nil
    end
  end

  def get_paging_count
    "TODO"
  end

  def attach_base_template_params
    @base = {
      status: {
        version: Settings.version,
        code: nil,
        message: nil
      },
      paging:{
        count: nil,
        prev: nil,
        curr: nil,
        next: nil 
      },
      debug: {
        elapsed: nil,
        target_debug: nil,
        memory_usage: nil,
        served: nil,
        api_key_check: 'disabled',
        route: 'all_db_search'
      }
    }
  end

  # TODO: Move HTTP concern
  def cors_preflight_check
    if request.method == 'OPTIONS'
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
      headers['Access-Control-Request-Method'] = '*'
      headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      headers['X-Powered-By'] = 'MShanken Communications'
      render :nothing => true, :content_type => 'text/plain'
    end
  end
end
{% endhighlight %}

BaseController contains generic API behaviours that are to be implemented by any API issued by the dev team: centralizing API bugs and features. These are not implemented directly in APIController as APIController is allowed to vary between versions whereas the features of the BaseController concern are assumed to be long lasting. There's still some cruft in this controller that should be moved to the QueryableController concern.

QueryableController
--------------------

{% highlight ruby %}
#app/controllers/concerns/queryable_controller.rb*
module QueryableController
  extend ActiveSupport::Concern

  included do
    if ENV["RAILS_ENV"] == "production"
      rescue_from Elasticsearch::Transport::Transport::Errors::BadRequest, :with => :bad_query
    end
  end

  def bad_query
    respond_to do |format|
      format.html { render '/api/v1/400.json.jbuilder', :status => 400, :content_type => 'application/json' }
      format.json { render '/api/v1/400.json.jbuilder', :status => 400, :content_type => 'application/json' }
    end
  end

  def query
    @query_body = @query_body || params[:body]
    render_query({
      query_type: @query_type,
      index: @index,
      type: @type,
      template: @template,
      body: @query_body
    })
  end

end
{% endhighlight %}

`QueryableController` largely contains methods for handling Elasticsearch queries.


{% highlight ruby %}
#app/controllers/api/v1/wines_controller.rb*
module Api
  module V1
    class WinesController < ApiController
      include AutocompleteController

      def create
        @result = Wine.new create_params
        @result.winery = Winery.find winery_params

        rp = region_params
        if rp
          @result.region = Region.find rp
        end

        sp = style_params
        if sp
          @result.styles = Style.find sp
        end

        wtp = wine_tag_params
        if wtp
          @result.wine_tags = WineTag.find wtp
        end

        @result.save!
        show
      end

      def update
        @result = Wine.find( params[:id] )

        rp = region_params
        @result.region = rp ? Region.find( rp ) : nil

        sp = style_params
        if sp
          @result.styles = Style.find sp
        else
          @result.styles.clear
        end

        wtp = wine_tag_params
        if wtp
          @result.wine_tags = WineTag.find wtp 
        else
          @result.wine_tags.clear
        end

        @result.update_attributes update_params
        show
      end
    
      def show
        @result ||= Wine.includes( :region, :winery, :styles, :wine_tags ).find( params[:id] )
        super
      end


      def vintages
        render_template({
          results: WineVintage.includes( :appellations, :grape_aliases, :importers ).where( :wine_id => params[:id] ).paginate(page: params[:page], :per_page => Settings.page_size ),
          template: "api/v1/wines/vintages.json.jbuilder"
        })
      end

      def bottlings
        render_template({
          results: Bottle.includes( :accolades, :wine, :wine_vintage, :wine_container ).where( :wine_vintage_id => "#{params[:id]}/#{params[:vintage]}" ).paginate(page: params[:page], :per_page => Settings.page_size ),
          template: "api/v1/bottles/index.json.jbuilder"
        })
      end
  
      protected

      def create_params
        params.require( :item ).permit( :name, :color, :type, :nv, :description )
      end

      def winery_params
        params[:item][:winery][:id] rescue nil
      end

      def region_params
        params[:item][:region][:id] rescue nil
      end

      def style_params
        params[:item][:styles].collect { |s| s[:id] } rescue nil
      end

      def wine_tag_params
        params[:item][:tags].collect { |s| s[:id] } rescue nil
      end

    end
  end
end
{% endhighlight %}

At last we arrive at a model's controller. By this point we've piled on the parent methods and only need to implment route-specific behaviours and template rendering. Each of the crud methods implicitly source templates according to standard rails rules. These controllers are expected to vary by API version and are free to implement their concerns and gems.

AutocompleteController
---------------------
{% highlight ruby %}
#app/controllers/concerns/autocomplete_controller.rb*
module AutocompleteController
  extend ActiveSupport::Concern

  included do
    before_action :route_show, only: [:show]
  end

  def autocomplete
    @query_type = "search"
    @index = "#{controller_name}_index"
    @type = "#{controller_name.classify.underscore}"
    @template = "/api/v1/indexes/#{controller_name.underscore}/autocomplete.json.jbuilder"
    if params[:term]
      @query_body = {
        query: {
          match: {
            name: params[:term]
          }
        },pp
        sort: [
          "_score",
          { name: "asc" }
        ]
      }
    else
      @query_body = {
        query: {
          match_all: {}
        },
        sort: [
          { name: "asc" }
        ]
      }
    end
    query
  end

  def route_show
    if params[:action] == 'show' && params[:id] == 'autocomplete'
      autocomplete
    end
  end
end
{% endhighlight %}

This concern largely implements autocomplete behaviour via Elasticsearch.

**Update 6/26/2016:** Added syntax highlighting. These are legacy patterns left here for reference. We thought this was really awesome back in the day.