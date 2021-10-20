import { Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import { withRouter, Route, useLocation } from 'react-router-dom';

import { bgGrey } from './style';

const App = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: bgGrey }}></Layout>
  );
};
