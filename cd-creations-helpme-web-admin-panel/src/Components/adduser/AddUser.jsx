
import React, { useState } from 'react'; 
import Navbar from "../../components/nevbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./adduser.scss"
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


const AddUser = () => {
    const [componentDisabled, setComponentDisabled] = useState(true);
  return (
    <div className='adduser'>
         <Sidebar/>
         <div className='adduserContainer'>
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
        }}
      >
        <Form.Item label="states" name="disabled" valuePropName="checked">
          <Checkbox>Inactive</Checkbox>
        </Form.Item>

        <Form.Item label="User Name" 
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

        <Form.Item label="Gender">
          <Radio.Group>
            <Radio value="Male"> Male </Radio>
            <Radio value="Female"> Female </Radio>
            <Radio value="Other"> Other </Radio>
          </Radio.Group>
       </Form.Item>

       <Form.Item label="Name">
          <Input />
        </Form.Item>

       <Form.Item label="Password" name="password"
            rules={[
              {
               required: true,
               message: 'Please input your password!',
              },
              ]}
        > <Input.Password />
       </Form.Item>

       
        <Form.Item label="User Roll">
          <Select>
            <Select.Option value="Administrator">Administrator</Select.Option>
            <Select.Option value="Accountant">Accountant</Select.Option>
            <Select.Option value="Order collector">Order collector</Select.Option>
          </Select>
        </Form.Item>

      
        <Form.Item label="Create Date">
          <DatePicker />
        </Form.Item>

        
       
        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload action="/upload.do" listType="picture-card">
            <button
              style={{
                border: 0,
                background: 'none',
              }}
              type="button"
            >
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </button>
          </Upload>
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

export default AddUser
