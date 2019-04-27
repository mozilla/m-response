m-response
==========

Set up local environment
------------------------

To set up the project VM you’ll need VirtualBox and Vagrant. You can
start it up using the following commands.

.. code:: sh

   vagrant up
   vagrant ssh

The VM comes with aliases:

-  ``dj`` - shortcut to ``django-admin``
-  ``djrun`` - shortcut to ``django-admin runserver 0:8000``

Compile static assets
~~~~~~~~~~~~~~~~~~~~~

.. code:: sh

   vagrant ssh
   cd mresponse/frontend/app/
   yarn install
   yarn build

Or you can run those commands locally. There are known to be slow in a
VM on some platforms. We use Node 8 LTS and Yarn stable.

Create database and administrator user
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code:: sh

   vagrant ssh
   dj migrate
   dj createsuperuser

Start the server
~~~~~~~~~~~~~~~~

.. code:: sh

   vagrant ssh
   djrun

Then you can visit administration panel at http://localhost:8000/admin/.

The application uses external authentication. To log-in locally please do it
through the administration interface instead.

Auth0 Configuration
~~~~~~~~~~~~~~~~~~~

The project uses Auth0 as an authentication mechanism. To get Auth0 working
correctly you will need to a .env` configuration file (The required
variables can be seen in `./mresponse/frontend/app/.env.example`).

Developing on localhost can also cause issues with Auth0 so it is recommended
that you add the following to your `/etc/hosts/` file and develop from
http://mresponse.local/

.. code::

    127.0.0.1       mresponse.local

On the backend you need to set two environment variables - ``AUTH0_DOMAIN`` and
``JWT_ISSUER``.

Data Retrieval from the Google Playstore
~~~~~~~~~~~~~~~~~~~

To retrieve (download) reviews and publish (upload) responses on the Google Playstore, there is a small service.
This service lives in its own repo: https://github.com/mozilla/m-response-api


