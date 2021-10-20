import React from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Row, Col, Image, Button, Typography, Divider } from 'antd';

import GridLoading from '../components/GridLoading';
import ContainerLoading from '../components/ContainerLoading';

import { dateToString } from '../util/dates';

import { GET_RECOMMENDED_ARTICLES } from '../graphql/keymaker';

import { bgGrey, grey } from '../style';

const RecommendedArticles = () => {
  const { loading, error, data } = useQuery(GET_RECOMMENDED_ARTICLES, {
    fetchPolicy: 'no-cache',
    variables: { name: localStorage.getItem('username') },
  });

  if (loading || error) {
    return (
      <GridLoading
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={24}
        length={10}
        error={error}
        loading={loading}
      />
    );
  }
  if (data.recommendations.length === 0) {
    return <ContainerLoading center loading={loading} error={error} />;
  }
  return (
    <Row gutter={[12, 12]}>
      {data.recommendations.map((article, idx) => (
        <Col key={idx} xs={24} sm={24} md={24} lg={24} xl={24}>
          <ArticleContainer article={article.item} details={article.details} />
        </Col>
      ))}
    </Row>
  );
};

const ArticleContainer = ({ article, details }) => {
  const history = useHistory();
  const { datePosted } = details;
  const { title, key, sourceUrl, previewImageUrl, sentiment } = article;
  const { Title, Text } = Typography;

  return (
    <Row
      align="middle"
      justify="space-between"
      style={{
        padding: '12px 12px',
        borderRadius: '5px',
        backgroundColor: 'white',
      }}
    >
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <Row align="middle" justify="start" wrap={false} gutter={[12, 0]}>
          {previewImageUrl && (
            <Col>
              <div
                style={{
                  width: '65px',
                  height: '65px',
                  display: 'flex',
                  padding: '6px 6px',
                  borderRadius: '5px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: bgGrey,
                  // border: "1px solid " + bgGrey,
                }}
              >
                <Image
                  preview={false}
                  src={previewImageUrl}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'fill',
                    borderRadius: '5px',
                  }}
                />
              </div>
            </Col>
          )}
          <Col>
            <Row align="middle">
              <ClockCircleOutlined style={{ color: grey }} />
              <div style={{ width: '8px' }} />
              <Text type="secondary">{dateToString(datePosted)}</Text>
            </Row>
            <Title
              level={5}
              ellipsis={{ rows: 2, expandable: false }}
              style={{ fontWeight: '600', margin: '0px' }}
            >
              {title}
            </Title>
          </Col>
        </Row>
      </Col>
      <Col>
        <Row align="middle" justify="center">
          <Text
            style={{
              padding: '2px 12px',
              borderRadius: '100px',
              backgroundColor: sentiment > 0 ? '#e0fff0' : '#ffe0e0',
            }}
          >
            {'Sentiment: ' + sentiment}
          </Text>
        </Row>
      </Col>
      <Col>
        <Row align="middle">
          <Col>
            <Button ghost onClick={() => window.open(sourceUrl)}>
              Read
            </Button>
          </Col>
          <Divider type="vertical" style={{ height: '24px' }} />
          <Col>
            <Button
              type="primary"
              onClick={() => history.push('/article/' + key)}
            >
              Details
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default RecommendedArticles;
