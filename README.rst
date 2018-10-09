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

