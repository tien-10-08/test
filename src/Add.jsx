import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import Mst_Province from "./data/Mst_Province.json";

const { Option } = Select;

const Add = ({ onClose, onAddDistrict, districtData }) => {
  const [form] = Form.useForm();

  const isDuplicate = (code) => {
    return districtData.some(
      (item) => item.DistrictCode.toLowerCase() === code.toLowerCase(),
    );
  };

  const validateDistrict = (_, value) => {
    if (!value) return Promise.resolve();

    if (isDuplicate(value.trim())) {
      return Promise.reject("Mã Quận/Huyện đã tồn tại!");
    }

    return Promise.resolve();
  };

  const handleProvince = (value) => {
    const province = Mst_Province.find((item) => item.ProvinceCode === value);

    form.setFieldsValue({
      provinceName: province?.ProvinceName || "",
    });
  };

  const onFinish = (values) => {
    const newDistrict = {
      DistrictCode: values.districtCode.trim(),
      ProvinceCode: values.provinceCode,
      DistrictName: values.districtName.trim(),
      FlagActive: "1",
    };

    onAddDistrict?.(newDistrict);

    message.success("Đã thêm Quận/Huyện thành công!");

    form.resetFields();

    onClose?.();
  };

  return (
    <div className="form-container">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <table>
          <tbody>
            <tr>
              <td>
                <label>
                  Mã tỉnh <span className="required">(*)</span>
                </label>
              </td>

              <td>
                <Form.Item
                  name="provinceCode"
                  rules={[{ required: true, message: "Vui lòng chọn mã tỉnh" }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select placeholder="Chọn mã tỉnh" onChange={handleProvince}>
                    {Mst_Province.map((item) => (
                      <Option key={item.ProvinceCode} value={item.ProvinceCode}>
                        {item.ProvinceCode} - {item.ProvinceName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </td>
            </tr>

            <tr>
              <td>
                <label>Tên tỉnh</label>
              </td>

              <td>
                <Form.Item name="provinceName" style={{ marginBottom: 0 }}>
                  <Input disabled />
                </Form.Item>
              </td>
            </tr>

            <tr>
              <td>
                <label>
                  Mã Quận/Huyện <span className="required">(*)</span>
                </label>
              </td>

              <td>
                <Form.Item
                  name="districtCode"
                  style={{ marginBottom: 0 }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mã Quận/Huyện",
                    },
                    { validator: validateDistrict },
                  ]}
                >
                  <Input />
                </Form.Item>
              </td>
            </tr>

            <tr>
              <td>
                <label>Tên Quận/Huyện</label>
              </td>

              <td>
                <Form.Item
                  name="districtName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên Quận/Huyện" },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input />
                </Form.Item>
              </td>
            </tr>

            <tr>
              <td colSpan={2} align="center">
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Form>
    </div>
  );
};

export default Add;
