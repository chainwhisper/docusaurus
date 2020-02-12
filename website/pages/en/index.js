/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const translate = require('../../server/translate.js').translate;


const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = props => (
      <h2 className="projectTitle">
        {props.title}
        <small>{props.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle tagline={siteConfig.tagline} title={siteConfig.title} />
          <PromoSection>
            <Button href={docUrl('intro/intro.html')}>Overview</Button>
            <Button href="https://github.com/binance-chain/node-binary">Download</Button>
            <Button href={docUrl('create-wallet.html')}>Binance DEX Tutorial</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Feature Callout</h2>
        <MarkdownBlock>These are features of this project</MarkdownBlock>
      </div>
    );

    const LearnHow = () => (
      <Block id="try">
        {[
          {
            content:
              'Fast and secure decentralized digital asset exchange.</br>' +
              'The new crypto currency trading standard is here. ',
            image: `${baseUrl}img/dex.jpeg`,
            imageAlign: 'left',
            title: 'Binance DEX Trading Platform',
          },
        ]}
      </Block>
    );

    const Description = () => (
      <Block id="bounty" background="light">
        {[
          {
            content:
              '<u>[Binance](https://www.binance.com/en)</u> is collaborating with <u>[Bugcrowd](https://bugcrowd.com/binance) </u>'+
              'for a new round of bug bounty to ensure a more robust security system for DEX trading platform. ' +
              'In blockchain space, security engineers and researchers play a vital part of building a strong system. ',
            image: `${baseUrl}img/bugbounty.jpeg`,
            imageAlign: 'right',
            title: 'Binance Chain Bug Bounty',
          },
        ]}
      </Block>
    );

    const TryOut = () => (
      <Block background="light">
        {[
          {
            content:
              'Each new Docusaurus project has **randomly-generated** theme colors.',
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
            title: 'Randomly Generated Theme Colors',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="twoColumn">
        {[
          {
            content: '<u>Run your full node</u>.</br>'+
            'How to transfer BNB</br>'+
            'How to trade on Binance DEX </br>'+
            'Secure your funds',
            image: `${baseUrl}img/guides.png`,
            imageAlign: 'top',
            title: ' <translate>Guides</translate>',
          },
          {
            content: ' <a href="/docusaurus/docs/api/rpc"> <u>REST API</u></a> </br>' +
                      'Go SDK </br>'+
                      'JS SDK</br>'+
                      'Python SDK',
            image: `${baseUrl}img/sdk.jpeg`,
            imageAlign: 'top',
            title: '  <translate>Reference & SDKs</translate>',
          },
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (

         <div style={{position: 'absolute',left: '500px'}} >
          <form action="https://github.us4.list-manage.com/subscribe/post?u=a854b84e9b881f47819f938ef&amp;id=cd6fe7a07b" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
          <span  id="mc_embed_signup" className="mailSignup__title">Get developer updates:  </span>
          <input type="email" value="" name="EMAIL" className="mailSignup__input" placeholder="email address" required="true" style={{width:'200px'}}/>
          <input type="submit" value="Sign Up" name="subscribe" className="m-button mailSignup__submit"/>
          <div style={{position: 'absolute',left: '-5000px'}}aria-hidden="true"><input type="text" name="b_a854b84e9b881f47819f938ef_cd6fe7a07b" tabindex="-1" value=""/></div>
         </form>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <LearnHow />
          <Description />
          <Showcase />
        </div>
      </div>
    );
  }
}

Index.defaultProps = {
  language: 'en',
};

module.exports = Index;
