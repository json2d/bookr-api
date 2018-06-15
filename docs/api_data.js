define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Login Existing User",
    "name": "Login",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/auth/signup",
    "title": "Register New User",
    "name": "Signup",
    "group": "Authentication",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/books/checkout/:id",
    "title": "Checkout Book",
    "name": "Checkout",
    "group": "Books",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Book <code>id</code> to checkout</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Book",
            "optional": false,
            "field": "book",
            "description": "<p>checked-out Book object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "post",
    "url": "/books",
    "title": "Create Book",
    "name": "Create",
    "group": "Books",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Book",
            "optional": false,
            "field": "book",
            "description": "<p>created Book object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "delete",
    "url": "/books/:id",
    "title": "Delete Book",
    "name": "Delete",
    "group": "Books",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Book <code>id</code> to delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Book",
            "optional": false,
            "field": "book",
            "description": "<p>deleted Book object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "put",
    "url": "/books/:id",
    "title": "Fetch Book",
    "name": "Fetch",
    "group": "Books",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Book <code>id</code> to fetch</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Book",
            "optional": false,
            "field": "book",
            "description": "<p>fetched Book object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>token Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "get",
    "url": "/books",
    "title": "List All Books",
    "name": "List_All",
    "group": "Books",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "books",
            "description": "<p>List of all books.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "get",
    "url": "/books/by-category/:category",
    "title": "List Books By Category",
    "name": "List_By_Category",
    "group": "Books",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Category to find books by.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "books",
            "description": "<p>List of checked-out books.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "get",
    "url": "/books/checked-out",
    "title": "List Checked-out Books",
    "name": "List_Checked_out",
    "group": "Books",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "books",
            "description": "<p>List of checked-out books.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "get",
    "url": "/books/contributed",
    "title": "List Contributed Books",
    "name": "List_Contributed",
    "group": "Books",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "books",
            "description": "<p>List of contributed books.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "post",
    "url": "/books/return/:id",
    "title": "Return Book",
    "name": "Return",
    "group": "Books",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Book <code>id</code> to return</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Book",
            "optional": false,
            "field": "book",
            "description": "<p>returned Book object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "put",
    "url": "/books/:id",
    "title": "Update Book",
    "name": "Update",
    "group": "Books",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Book <code>id</code> to update</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Book",
            "optional": false,
            "field": "book",
            "description": "<p>updated Book object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/books.js",
    "groupTitle": "Books"
  },
  {
    "type": "get",
    "url": "/categories",
    "title": "List All Categories",
    "name": "List_All",
    "group": "Categories",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "categories",
            "description": "<p>List of all categories.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Access token for User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/categories.js",
    "groupTitle": "Categories"
  }
] });
