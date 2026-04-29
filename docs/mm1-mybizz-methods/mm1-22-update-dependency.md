Example of test to confirm dependency operation wrt client data security and update architecture


Dependency Client app: frm_dependency_client:
from ._anvil_designer import frm_dependency_clientTemplate
from anvil import *
import anvil.server
class frm_dependency_client(frm_dependency_clientTemplate):
  def __init__(self, **properties):
    self.init_components(**properties)
    # Get data from OUR server function
    business_name = anvil.server.call('get_my_business_name')
    # The Host component was already added in the designer
    # We just need to set its business_name property
    self.frm_dependency_host_1.business_name = business_name

Dependency Client app: sm_client_data:
import anvil.server
@anvil.server.callable
  clients = app_tables.clients.search()
		from anvil.tables import app_tables
def get_my_business_name():
  return list(clients)[0]['business_name']

Dependency Client app: Database Schema:
		import anvil.tables as tables
Attached image

When running Dependency Client app:
"Client: test_company" displays in the Outlined Card

Dependency Host app: frm_dependency_host:
from ._anvil_designer import frm_dependency_hostTemplate
from anvil import *
class frm_dependency_host(frm_dependency_hostTemplate):
  def __init__(self, **properties):
    self.init_components(**properties)
  @property
  def business_name(self):
    return self._business_name
  @business_name.setter
  def business_name(self, value):
    self._business_name = value
    self.lbl_hello_world.text = f"Client: {value}"

Dependency Host app: sm_data_access:
import anvil.server
import anvil.tables as tables
from anvil.tables import app_tables
@anvil.server.callable
def get_client_name():
  try:
    clients = app_tables.clients.search()
    client_name = list(clients)[0]['business_name']
    return f"Client: {client_name}"
  except Exception as e:
    return f"Error: {str(e)}"

When running Dependency Host app:
"Hello world" displays.

**********************************************************************************

What we've just proven:
 Client app can use forms from Host app (as dependencies)
 Client app has its own isolated data tables
 Client app fetches its own data and passes it to Host components
 Host app never accesses Client data directly

This confirms the dependency model works for MyBizz!
Key learnings:
	1. Each client has their own Anvil account with their own data tables
	2. All clients import forms/components from your Master Template (Host)
	3. Clients fetch their data and pass it to your components via properties
	4. When you publish an update to the Master, all clients get it automatically

