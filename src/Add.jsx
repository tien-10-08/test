import React from "react";
import { Form, Input, Button, Select, Row, Col, message } from "antd";
import Mst_Province from "./data/Mst_Province.json";

const { Option } = Select;

const Add = ({ onClose, onAddDistrict, districtData }) => {
  const [form] = Form.useForm();

  const isDuplicateDistrictCode = (code) => {
    return districtData.some(
      (item) => item.DistrictCode.toLowerCase() === code.toLowerCase(),
    );
  };

  const validateDistrictCode = (_, value) => {
    if (!value) return Promise.resolve();

    const trimmed = value.trim();

    if (isDuplicateDistrictCode(trimmed)) {
      return Promise.reject(new Error("Mã Quận/Huyện đã tồn tại"));
    }

    return Promise.resolve();
  };

  const handleProvinceChange = (provinceCode) => {
    const province = Mst_Province.find(
      (item) => item.ProvinceCode === provinceCode,
    );

    form.setFieldsValue({
      provinceName: province?.ProvinceName || "",
    });
  };

  const handleSubmit = (values) => {
    const newDistrict = {
      DistrictCode: values.districtCode.trim(),
      ProvinceCode: values.provinceCode,
      DistrictName: values.districtName.trim(),
      FlagActive: "1",
    };

    onAddDistrict?.(newDistrict);

    message.success("Thêm Quận/Huyện thành công");

    form.resetFields();

    onClose?.();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ marginTop: 16 }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Mã tỉnh"
            name="provinceCode"
            rules={[{ required: true, message: "Vui lòng chọn mã tỉnh" }]}
          >
            <Select placeholder="Chọn mã tỉnh" onChange={handleProvinceChange}>
              {Mst_Province.map((item) => (
                <Option key={item.ProvinceCode} value={item.ProvinceCode}>
                  {item.ProvinceCode} - {item.ProvinceName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Tên tỉnh" name="provinceName">
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Mã Quận/Huyện"
            name="districtCode"
            rules={[
              { required: true, message: "Vui lòng nhập mã Quận/Huyện" },
              { validator: validateDistrictCode },
            ]}
          >
            <Input placeholder="Nhập mã Quận/Huyện" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Tên Quận/Huyện"
            name="districtName"
            rules={[
              { required: true, message: "Vui lòng nhập tên Quận/Huyện" },
            ]}
          >
            <Input placeholder="Nhập tên Quận/Huyện" />
          </Form.Item>
        </Col>
      </Row>

      <Row justify="center">
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Row>
    </Form>
  );
};

export default Add;
