
import React, { useState } from 'react';
import Navbar from "../../components/nevbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./privilae.scss"
import { PlusOutlined } from '@ant-design/icons';
import { Button, Cascader, Checkbox, ColorPicker, DatePicker, Form, Input, InputNumber, Radio, Select, Slider, Switch, TreeSelect, Upload, } from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};


const Privilage = () => {
  const [componentDisabled, setComponentDisabled] = useState(true);
  return (
    <div className='privilage'>
        <Sidebar/>
      <div className="privilageContainer">
        <Navbar/>
        <div className='formContainer'>
        <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        disabled={componentDisabled}
        style={{
          maxWidth: 600,
        }}>
        <Form.Item label="states" name="disabled" valuePropName="checked">
          <Checkbox>Inactive</Checkbox>
        </Form.Item>

        <Form.Item label="User Roll" 
           rules={[
              {
               required: true,
               message: 'Please input your user name!',
              },
              ]}
              >  <Input />
       </Form.Item>

       <Form.Item label="Number">
          <InputNumber />
        </Form.Item>

        <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <div className='chexbox'>
      <Checkbox>Dashboard </Checkbox>
      <Checkbox>Users
      <div className='subchexbox'>
        <Checkbox> Delete</Checkbox>
        <Checkbox> View</Checkbox>
        </div>
      </Checkbox>
      <Checkbox>Sub Users
      <div className='subchexbox'>
        <Checkbox> Delete</Checkbox>
        <Checkbox> View</Checkbox>
        </div>
      </Checkbox>
      <Checkbox>Product</Checkbox>
      <Checkbox>Orders</Checkbox>
      <Checkbox>Delivery</Checkbox>
      <Checkbox>Notification</Checkbox>
      <Checkbox>Reports
      <div className='subchexbox'>
        <Checkbox> user report</Checkbox>
        <Checkbox> sub user report</Checkbox>
        <Checkbox> product report</Checkbox>
        <Checkbox> orders report</Checkbox>
        <Checkbox> delivary report</Checkbox>
        <Checkbox> taxi report</Checkbox>
        </div>
        </Checkbox>
      <Checkbox>Create User
      <div className='subchexbox'>
        <Checkbox> add user</Checkbox>
        <Checkbox> delete user</Checkbox>
        <Checkbox> view details</Checkbox>
        <Checkbox> active user</Checkbox>
        <Checkbox> inactive user</Checkbox>
        <Checkbox> Submit</Checkbox>
        </div>
      </Checkbox>
      <Checkbox>Create Roll
      <div className='subchexbox'>
        <Checkbox> add user roll</Checkbox>
        <Checkbox> delete user roll</Checkbox>
        <Checkbox> view user roll</Checkbox>
        <Checkbox> active user roll</Checkbox>
        <Checkbox> inactive user roll</Checkbox>
        </div>
      </Checkbox>
      <Checkbox>Taxi Driver</Checkbox>
    
      </div>
    </Form.Item>

   

        <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>

        </Form>
        </div>
        </div>
      
    </div>
  )
}

export default Privilage
