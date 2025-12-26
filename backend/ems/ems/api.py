import frappe
from frappe import _
import json

@frappe.whitelist(allow_guest=True)
def login_with_credentials():
    try:
        if frappe.request.data:
            data = json.loads(frappe.request.data)
            email = data.get('email')
            password = data.get('password')
        else:
            email = frappe.form_dict.get('email')
            password = frappe.form_dict.get('password')
    except:
        email = frappe.form_dict.get('email')
        password = frappe.form_dict.get('password')
    
    if not email or not password:
        frappe.local.response['http_status_code'] = 400
        return {
            'success': False,
            'message': 'Email and password are required'
        }
    
    try:
        frappe.local.login_manager.authenticate(email, password)
        frappe.local.login_manager.post_login()
        
        user = frappe.get_doc('User', email)
        
        if not user.api_key:
            user.api_key = frappe.generate_hash(length=15)
        
        if not user.get_password('api_secret'):
            user.api_secret = frappe.generate_hash(length=15)
            
        user.save(ignore_permissions=True)
        frappe.db.commit()
        
        roles = frappe.get_roles(email)
        
        role = 'employee'
        if 'Administrator' in roles or 'EMS Admin' in roles:
            role = 'admin'
        elif 'EMS Manager' in roles:
            role = 'manager'
        
        return {
            'success': True,
            'data': {
                'token': f"{user.api_key}:{user.get_password('api_secret')}",
                'user': {
                    'id': user.name,
                    'email': user.email,
                    'name': user.full_name or user.name,
                    'role': role
                }
            }
        }
        
    except frappe.exceptions.AuthenticationError:
        frappe.local.response['http_status_code'] = 401
        return {
            'success': False,
            'message': 'Invalid email or password'
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'Login Error')
        frappe.local.response['http_status_code'] = 500
        return {
            'success': False,
            'message': str(e)
        }


@frappe.whitelist()
def delete_department(department_id):
    try:
        frappe.delete_doc('Department', department_id, ignore_permissions=True)
        frappe.db.commit()
        return {'success': True}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'Delete Department Error')
        return {'success': False, 'message': str(e)}


@frappe.whitelist()
def delete_company(company_id):
    try:
        frappe.delete_doc('Company', company_id, ignore_permissions=True)
        frappe.db.commit()
        return {'success': True}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'Delete Company Error')
        return {'success': False, 'message': str(e)}


@frappe.whitelist()
def delete_employee(employee_id):
    try:
        frappe.delete_doc('Employee', employee_id, ignore_permissions=True)
        frappe.db.commit()
        return {'success': True}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'Delete Employee Error')
        return {'success': False, 'message': str(e)}


@frappe.whitelist()
def update_user_profile(full_name=None, email=None):
    try:
        user_id = frappe.session.user
        
        if full_name:
            frappe.db.set_value('User', user_id, 'full_name', full_name, update_modified=False)
        
        if email and email != user_id:
            return {
                'success': False,
                'message': 'Email cannot be changed. Contact admin.'
            }
        
        frappe.db.commit()
        
        user = frappe.get_doc('User', user_id)
        
        return {
            'success': True,
            'data': {
                'full_name': user.full_name,
                'email': user.email
            }
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'Update Profile Error')
        return {
            'success': False,
            'message': str(e)
        }


@frappe.whitelist()
def change_user_password(old_password, new_password):
    try:
        from frappe.core.doctype.user.user import check_password
        
        user_id = frappe.session.user
        
        if not check_password(user_id, old_password):
            return {
                'success': False,
                'message': 'Current password is incorrect'
            }
        
        user = frappe.get_doc('User', user_id)
        user.new_password = new_password
        user.save(ignore_permissions=True)
        frappe.db.commit()
        
        return {'success': True}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'Change Password Error')
        return {
            'success': False,
            'message': str(e)
        }
