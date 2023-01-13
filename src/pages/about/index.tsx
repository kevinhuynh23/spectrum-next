import Image from 'next/image';
import sources from '../../../public/VarietyOfSources.png';
import analytics from '../../../public/Analytics.png';
import categories from '../../../public/Categories.png';
import ContactCard from '../../common/components/elements/contactCard';
import { Container, Grid } from '@mantine/core';

const AboutPage = () => {
  return (
    <Container>
      <div className="container" id="landing-background">
        <h2 className="landing-title" id="intro">
          Widen your perspective.
        </h2>
        <h2 className="landing-title" id="intro">
          Challenge your views.
        </h2>
      </div>
      <div className="container" id="gray-container">
        <h2 className="landing-title">Meet Spectrum</h2>
        <div className="description-row">
          <p className="description-body">Spectrum is a melting pot of different sources and types of </p>
          <p className="description-body">news, all on one website. We challenge individuals to read </p>
          <p className="description-body">from multiple sources and categories and encourage users to </p>
          <p className="description-body">reflect on their personal reading habits. Our vision is to create </p>
          <p className="description-body">a place where people can continuously develop a well-rounded </p>
          <p className="description-body">understanding of current events in the world we live in.</p>
        </div>
      </div>

      <h2 className="landing-title">What makes us different</h2>
      <div className="row">
        <Grid>
          <Grid.Col span={4}>
            <div className="row image-row">
              <Image className="profile-img" src={sources} alt="sources" width={100} height={100} />
            </div>
            <div className="row">
              <h3 className="profile-name">Variety of Sources</h3>
            </div>
            <div className="row center-text">
              <p>Read from over 100 different sources and digest different perspectives.</p>
            </div>
          </Grid.Col>
          <Grid.Col span={4}>
            <div className="row image-row">
              <Image className="profile-img" src={analytics} alt="analytics" width={100} height={100} />
            </div>
            <div className="row">
              <h3 className="profile-name">Analytics</h3>
            </div>
            <div className="row center-text">
              <p>Create an account and discover a personalized dashboard visualizing your reading habits.</p>
            </div>
          </Grid.Col>
          <Grid.Col span={4}>
            <div className="row image-row">
              <Image className="profile-img" src={categories} alt="categories" width={100} height={100} />
            </div>
            <div className="row">
              <h3 className="profile-name">Categories</h3>
            </div>
            <div className="row center-text">
              <p>Widen your variety of news intake and draw from a range of categories.</p>
            </div>
          </Grid.Col>
        </Grid>
      </div>
      <h2 className="landing-title">Meet the team!</h2>
      <Grid>
        <Grid.Col span={6}>
          <div className="row image-row">
            <a href="https://www.linkedin.com/in/kevinhuynh23/" />
          </div>
          <div className="row">
            <h3 className="profile-name">Kevin Huynh</h3>
          </div>
        </Grid.Col>
        <Grid.Col span={6}>
          <div className="row image-row">
            <a href="https://www.linkedin.com/in/andrewhwang10/" />
          </div>
          <div className="row">
            <h3 className="profile-name">Andrew Hwang</h3>
          </div>
        </Grid.Col>
      </Grid>
      <ContactCard />
    </Container>
  );
};

export default AboutPage;
