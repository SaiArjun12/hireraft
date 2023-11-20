import React, { useState, useEffect } from 'react';
// import 'antd/dist/antd.css';

import { Table, Input, Space, Pagination, Checkbox } from 'antd';


const ReusableTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
  const [hideIDColumn,setHideIDColumn]=useState(false);
  const [columnSearchText, setColumnSearchText] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const jsonData = await response.json();
        setData(jsonData);
        setFilteredData(jsonData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);
  const handleColumnSearch = (selectedColumn, value) => {
    const newColumnSearchText = { ...columnSearchText, [selectedColumn]: value.toLowerCase() };
    setColumnSearchText(newColumnSearchText);

    const filtered = filteredData.filter((item) =>
      Object.entries(newColumnSearchText).every(([column, searchValue]) =>
        item[column]?.toString().toLowerCase().includes(searchValue)
      )
    );

    setFilteredData(filtered);
    setPagination({ ...pagination, current: 1 });
  };

  const handleColumnSearchClear = (selectedColumn) => {
    const newColumnSearchText = { ...columnSearchText };
    delete newColumnSearchText[selectedColumn];
    setColumnSearchText(newColumnSearchText);

    const filtered = filteredData.filter((item) =>
      Object.entries(newColumnSearchText).every(([column, searchValue]) =>
        item[column]?.toString().toLowerCase().includes(searchValue)
      )
    );

    setFilteredData(filtered);
    setPagination({ ...pagination, current: 1 });
  };

  const handleSort = (column) => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[column] && b[column]) {
        return a[column].toString().localeCompare(b[column].toString());
      }
      return 0;
    });

    setFilteredData(sortedData);
  };
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchText(searchText);

    const filtered = data.filter(
      (item) =>
        Object.values(item).some((val) => val.toString().toLowerCase().includes(searchText))
    );
    setFilteredData(filtered);
    setPagination({ ...pagination, current: 1 });
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const handleCheckboxChange = (checkedValues) => {
    const updatedFilters = { ...selectedFilters };
    checkedValues.forEach((value) => {
      updatedFilters[value] = true;
    });

    setSelectedFilters(updatedFilters);

    let filtered;
    if (checkedValues.length === 0) {
      
      filtered = data;
    } else {
      
      filtered = data.filter((item) =>
        checkedValues.some((category) => item.category === category)
      );
    }
  
    setFilteredData(filtered);
    setPagination({ ...pagination, current: 1 });
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      visible:!hideIDColumn,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      ellipsis: true,
     visible:true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
      ellipsis: true,
      visible: true,
    },
    {
      title: 'Image',
      dataIndex: 'image', 
      render: (imageURL) => <img src={imageURL} alt="Product" style={{ width: '150px',height:'80px' }} />, 
      visible: true,
    },
    
  ];
  const handleHideIDColumn=(checked)=>{
    setHideIDColumn(checked);
  };

  return (
    <div>
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <Input placeholder="Search" onChange={handleSearch} />
        {columns.map((column) => (
          <Input
            key={column.dataIndex}
            placeholder={`Search ${column.title}`}
            onChange={(e) => handleColumnSearch(column.dataIndex, e.target.value)}
            value={columnSearchText[column.dataIndex] || ''}
            style={{ width: 150, marginBottom: 8 }}
            allowClear
            suffix={
              <span
                onClick={() => handleColumnSearchClear(column.dataIndex)}
                style={{ cursor: 'pointer' }}
              >
                Clear
              </span>
            }
          />
        ))}
        <Checkbox onChange={(e) => handleHideIDColumn(e.target.checked)}>
          Hide ID column
        </Checkbox>
      </Space>
      <Table
        columns={columns.filter((column) => column.visible)}
        dataSource={filteredData}
        pagination={{ ...pagination, key: Math.random() }}
        onChange={handlePaginationChange}
        onHeaderCell={(column) => ({
          onClick: () => handleSort(column.dataIndex),
        })}
      />
        {/* <Checkbox.Group onChange={handleCheckboxChange}>
          {Array.from(new Set(data.map((item) => item.category))).map((category) => (
            <Checkbox key={category} value={category}>
              {category}
            </Checkbox>
          ))}
        </Checkbox.Group>
        <Checkbox onChange={(e)=>handleHideIDColumn(e.target.checked)}>
          Hide ID column
        </Checkbox> */}
      {/* </Space>
      <Table */}
        {/* columns={columns.filter((column)=>column.visible)}
        dataSource={filteredData}
        pagination={{...pagination,key:Math.random()}}
        onChange={handlePaginationChange} */}
      {/* /> */}
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={data.length}
        onChange={handlePaginationChange}
      />
    </div>
  );
};

export default ReusableTable;
