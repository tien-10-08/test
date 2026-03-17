import React, { useState, useMemo, useEffect } from "react";
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

const STORAGE_KEY = "district-storage";

const CardView = () => {
  const [form] = Form.useForm();

  const [districtData, setDistrictData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : Mst_District;
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const [filters, setFilters] = useState({
    province: null,
    district: null,
    status: null,
  });

  const [provinceSearch, setProvinceSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(districtData));
  }, [districtData]);

  const provinceOptions = useMemo(() => {
    return Mst_Province.filter((p) =>
      p.ProvinceName.toLowerCase().includes(provinceSearch.toLowerCase()),
    ).map((p) => ({
      value: p.ProvinceName,
      code: p.ProvinceCode,
    }));
  }, [provinceSearch]);

  const districtOptions = useMemo(() => {
    if (!filters.province) return [];

    const provinceObj = Mst_Province.find(
      (p) => p.ProvinceName === filters.province,
    );

    if (!provinceObj) return [];

    return districtData
      .filter(
        (d) =>
          d.ProvinceCode === provinceObj.ProvinceCode &&
          d.DistrictName.toLowerCase().includes(districtSearch.toLowerCase()),
      )
      .map((d) => ({
        value: d.DistrictName,
        code: d.DistrictCode,
      }));
  }, [districtSearch, districtData, filters.province]);

  const resultData = useMemo(() => {
    const provinceObj = Mst_Province.find(
      (p) => p.ProvinceName === filters.province,
    );

    return districtData.filter((item) => {
      const matchProvince = provinceObj
        ? item.ProvinceCode === provinceObj.ProvinceCode
        : true;

      const matchDistrict = filters.district
        ? item.DistrictName === filters.district
        : true;

      const matchStatus =
        filters.status === "active"
          ? item.FlagActive === "1"
          : filters.status === "inactive"
            ? item.FlagActive === "0"
            : true;

      return matchProvince && matchDistrict && matchStatus;
    });
  }, [districtData, filters]);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setFilters(values);
    setSelectedItems([]);
  };

  const handleSelectCheckbox = (code, checked) => {
    setSelectedItems((prev) =>
      checked ? [...prev, code] : prev.filter((item) => item !== code),
    );
  };

  const handleDelete = () => {
    const updated = districtData.filter(
      (item) => !selectedItems.includes(item.DistrictCode),
    );

    setDistrictData(updated);
    setSelectedItems([]);
  };

  const handleAddDistrict = (newDistrict) => {
    setDistrictData((prev) => [newDistrict, ...prev]);
  };

  return (
    <Card style={{ padding: 16, width: "50%", margin: "0 auto" }}>
      <Form form={form}>
        <div style={{ display: "flex" }}>
          <Col span={12}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <div style={{ display: "flex", gap: 8 }}>
                <label style={{ width: 110, lineHeight: "32px" }}>
                  Tỉnh/TP
                </label>

                <Form.Item
                  name="province"
                  style={{ width: 180, marginBottom: 0 }}
                >
                  <AutoComplete
                    placeholder="Nhập Tỉnh/TP"
                    options={provinceOptions}
                    onSearch={setProvinceSearch}
                    allowClear
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <label style={{ width: 110, lineHeight: "32px" }}>
                  Quận/Huyện
                </label>

                <Form.Item
                  name="district"
                  style={{ width: 180, marginBottom: 0 }}
                >
                  <AutoComplete
                    placeholder="Nhập Quận/Huyện"
                    options={districtOptions}
                    onSearch={setDistrictSearch}
                    disabled={!filters.province}
                    allowClear
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <label style={{ width: 110, lineHeight: "32px" }}>
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
            <div style={{ display: "flex", gap: 10 }}>
              <Button type="primary" danger onClick={handleDelete}>
                Xóa
              </Button>

              <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
                Thêm
              </Button>
            </div>
          </Row>

          <div style={{ marginTop: 24 }}>
            {resultData.map((item) => (
              <Card key={item.DistrictCode} style={{ marginBottom: 16 }}>
                <Row justify="space-between">
                  <Col style={{ display: "flex", gap: 8 }}>
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
