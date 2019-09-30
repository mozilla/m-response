# -*- mode: ruby -*-
# vi: set ft=ruby :

require 'yaml'

# Output utils
def colorize(text, color_code)
  "\e[#{color_code}m#{text}\e[0m"
end
def red(text); colorize(text, 31); end


Vagrant.configure(2) do |config|
  config.vm.box = "torchbox/wagtail-stretch64"
  config.vm.box_version = "~> 1.0"

  config.vm.network "forwarded_port", guest: 8000, host: 8000

  config.vm.provision :shell, :path => "vagrant/provision.sh", :args => "mresponse"

  config.ssh.forward_agent = true

  if File.exist? "Vagrantfile.local"
    instance_eval File.read("Vagrantfile.local"), "Vagrantfile.local"
  end
end
