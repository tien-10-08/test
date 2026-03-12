import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  AutoComplete,
  Button,
  Card,
  Space,
  Checkbox,
  Form,
  Select,
  Modal,
} from "antd";

import Mst_District from "./data/Mst_District.json";
import Mst_Province from "./data/Mst_Province.json";
import Add from "./Add";

const { Option } = Select;

const findProvince = (provinceName) =>
  Mst_Province.find((p) => p.ProvinceName === provinceName);

const findDistrict = (districtData, districtName) =>
  districtData.find((d) => d.DistrictName === districtName);

const filterDistrictList = (districtData, province, district, status) => {
  const provinceObj = findProvince(province);
  const districtObj = findDistrict(districtData, district);

  return districtData.filter((item) => {
    const matchProvince = provinceObj
      ? item.ProvinceCode === provinceObj.ProvinceCode
      : true;

    const matchDistrict = districtObj
      ? item.DistrictCode === districtObj.DistrictCode
      : true;

    const matchStatus =
      status === "active"
        ? item.FlagActive === "1"
        : status === "inactive"
          ? item.FlagActive === "0"
          : true;

    return matchProvince && matchDistrict && matchStatus;
  });
};

const getProvinceOptions = (searchValue) =>
  Mst_Province.filter((p) =>
    p.ProvinceName.toLowerCase().includes(searchValue.toLowerCase()),
  ).map((p) => ({
    value: p.ProvinceName,
    code: p.ProvinceCode,
  }));

const CardView = () => {
  const [form] = Form.useForm();

  const [districtData, setDistrictData] = useState(Mst_District);
  const [resultData, setResultData] = useState([]);

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const handleProvinceSearch = (value) => {
    setProvinceOptions(getProvinceOptions(value));
  };

  const handleSearch = () => {
    const { province, district, status } = form.getFieldsValue();

    const filtered = filterDistrictList(
      districtData,
      province,
      district,
      status,
    );

    setResultData(filtered);
    setSelectedItems([]);
  };

  const handleSelectCheckbox = (districtCode, checked) => {
    setSelectedItems((prev) =>
      checked
        ? [...prev, districtCode]
        : prev.filter((code) => code !== districtCode),
    );
  };

  const handleDelete = () => {
    setResultData((prev) =>
      prev.filter((item) => !selectedItems.includes(item.DistrictCode)),
    );

    setSelectedItems([]);
  };

  const handleAddDistrict = (newDistrict) => {
    const updated = [newDistrict, ...districtData];

    const { province, district, status } = form.getFieldsValue();

    const filtered = filterDistrictList(updated, province, district, status);

    setDistrictData(updated);
    setResultData(filtered);
  };

  return (
    <Card style={{ padding: 16, width: "50%", margin: "0 auto" }}>
      <Form form={form}>
        <div style={{ display: "flex" }}>
          <Col span={12}>
            <Space style={{ width: "100%", flexDirection: "column" }} size={8}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label
                  style={{ width: 110, textAlign: "left", lineHeight: "32px" }}
                >
                  Tỉnh/TP
                </label>

                <Form.Item
                  name="province"
                  style={{ width: 180, marginBottom: 0 }}
                >
                  <AutoComplete
                    placeholder="Nhập tên Tỉnh/TP"
                    onSearch={handleProvinceSearch}
                    options={provinceOptions}
                    allowClear
                    filterOption={false}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <label
                  style={{ width: 110, textAlign: "left", lineHeight: "32px" }}
                >
                  Quận/Huyện
                </label>

                <Form.Item
                  name="district"
                  style={{ width: 180, marginBottom: 0 }}
                >
                  <AutoComplete
                    placeholder="Nhập tên Quận/Huyện"
                    allowClear
                    disabled={!form.getFieldValue("province")}
                    filterOption={false}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label
                  style={{ width: 110, textAlign: "left", lineHeight: "32px" }}
                >
                  Trạng thái
                </label>

                <Form.Item
                  name="status"
                  style={{ width: 180, marginBottom: 0 }}
                >
                  <Select placeholder="Chọn trạng thái" allowClear>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </Form.Item>
              </div>
            </Space>
          </Col>

          <div>
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
        </div>

        <Modal
          title="Thêm mới"
          open={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <Add
            onClose={() => setIsAddModalVisible(false)}
            districtData={districtData}
            onAddDistrict={handleAddDistrict}
          />
        </Modal>
      </Form>

      {resultData.length > 0 && (
        <>
          <Row style={{ marginTop: 24 }} justify="space-between">
            <div
              style={{
                width: "20%",
                justifyContent: "space-between",
                display: "flex",
              }}
            >
              <Button type="primary" danger onClick={handleDelete}>
                Xóa
              </Button>

              <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
                Thêm
              </Button>
            </div>

            <Select defaultValue="CardView" style={{ width: 120 }}>
              <Option value="CardView">CardView</Option>
              <Option value="ListView">ListView</Option>
            </Select>
          </Row>

          <div style={{ marginTop: 24 }}>
            {resultData.map((item) => (
              <Card key={item.DistrictCode} style={{ marginBottom: 16 }}>
                <Row justify="space-between">
                  <Col
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={selectedItems.includes(item.DistrictCode)}
                      onChange={(e) =>
                        handleSelectCheckbox(
                          item.DistrictCode,
                          e.target.checked,
                        )
                      }
                    />

                    <strong>{item.DistrictName}</strong>

                    <div>{item.DistrictCode}</div>
                  </Col>

                  <Col>
                    <div>{item.ProvinceCode}</div>
                    <div>{item.FlagActive === "1" ? "Active" : "Inactive"}</div>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default CardView;
