import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Divider, Button, Modal, Form, Input } from 'antd';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        visible, onCancel, onCreate, form,
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="新建"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              {getFieldDecorator('name')(<Input />)}
            </Form.Item>
            <Form.Item label="Address">
              {getFieldDecorator('address')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="Mobile">
              {getFieldDecorator('mobile')(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

@connect(({ bank, loading }) => ({
  bank,
  banksLoading: loading.models.bank,
}))
class Bank extends Component {
    state = {
        visible: false,
    };

    componentDidMount() {
        this.getBanks();
    }

    getBanks = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'bank/fetchBanks',
      });
    }

    showModal = () => {
        this.setState({ visible: true });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    handleCreate = () => {
      const { dispatch } = this.props;
      const form = this.formRef.props.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }

        console.log('Received values of form: ', values);
        dispatch({
          type: 'bank/fetchCreateBank',
          payload: {
            ...values,
          },
        });
        form.resetFields();
        this.setState({ visible: false });
        this.getBanks();
      });
    }

    saveFormRef = (formRef) => {
      this.formRef = formRef;
    }
    
    columns = [{
      title: 'Id',
      dataIndex: 'id',
    },{
      title: 'Name',
      dataIndex: 'name',
    },{
      title: 'Address',
      dataIndex: 'address',
    },{
      title: 'Mobile',
      dataIndex: 'mobile',
    },{
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;">更新</a>
          <Divider type="vertical" />
          <a href="javascript:;" onClick={() => this.handleDelete(record.id)}>删除</a>
        </span>
      ),
    }];

    handleDelete = (id) => {
        console.log(id);
        const { dispatch } = this.props;
        dispatch({
          type: 'bank/fetchDeleteBank',
          payload: {
            id: id,
          },
        });
        this.getBanks();
    };

    render() {
        const { bank, banksLoading } = this.props;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>新建</Button>
                <CollectionCreateForm
                  wrappedComponentRef={this.saveFormRef}
                  visible={this.state.visible}
                  onCancel={this.handleCancel}
                  onCreate={this.handleCreate}
                />
                <Table
                  columns={this.columns}
                  rowKey="id"
                  dataSource={bank.list}
                  loading={banksLoading}
                  />
            </div>
        )
    }
}

export default Bank;
