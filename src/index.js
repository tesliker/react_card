import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import Icon from '@material-ui/core/Icon';
import axios from 'axios';

const styles = {
  cardWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 -15px 0'
  },
  card: {
    display: 'block',
    flex: '0 0 43%',
    margin: '0px 15px 30px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto'
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
};

class RecipeReviewCard extends React.Component {
  state = { expanded: false, data: [] };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  innerHTML(markup) {
    return {__html: markup};
  }

  getUrlFromFile(d) {
    // console.log(d);
    if (d.relationships.field_image.data === null) {
      return '';
    }
    const fileId = d.relationships.field_image.data.id;
    const dataArray = this.state.data.data.included;
    for (var i = 0; i < dataArray.length; i++) {
      if (dataArray[i]['id'] === fileId) {
        return dataArray[i].attributes.uri.url;
      }
    }
    // console.log(fileId);
    // console.log(dataArray);
    return '';
  };

  getData = async () => {
    let cardSettings = {};
    const pdbConfig = drupalSettings.pdb.configuration;
    if (pdbConfig !== undefined) {
      for (var configId in pdbConfig) {
        if (pdbConfig[configId].node_type !== undefined) {
          cardSettings = pdbConfig[configId];
        }
      }
    }
    if (cardSettings.length <= 0) {
      return false;
    }
    try {
      const response = await axios.get('/jsonapi/node/' + cardSettings.node_type + '?&include=field_image&page[limit]=' + cardSettings.limit, {
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json',
            'Authorization': 'Basic YWRtaW46YWRtaW4='
        }
      });

      this.setState({data: response});
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const data = this.state.data;
    // console.log(data.data.jsonapi);
    const { classes } = this.props;

    if (data === undefined) {
      return false;
    }
    if (data.length <= 0) {
      return false;
    }
    if (data.data.data == undefined) {
      return false;
    }
    let i = 0;
    const listItems = data.data.data.map((d) =>
    <Card key={i++} style={styles.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="Recipe" style={styles.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton>
            <Icon>more_vert</Icon>
          </IconButton>
        }
        title={d.attributes.title}
        subheader="September 14, 2016"
      />
      <CardMedia
        style={styles.media}
        image={this.getUrlFromFile(d)}
        title={d.attributes.title}
      />
      <CardContent>
        <Typography component="p">
          {d.attributes.body.summary}
        </Typography>
      </CardContent>
      <CardActions style={styles.actions} disableActionSpacing>
        <IconButton aria-label="Add to favorites">
          <Icon>favorite</Icon>
        </IconButton>
        <IconButton aria-label="Share">
          <Icon>share</Icon>
        </IconButton>
        <IconButton
          style={styles.expand}
          onClick={this.handleExpandClick}
          aria-expanded={this.state.expanded}
          aria-label="Show more"
        >
          <Icon>expand_more</Icon>
        </IconButton>
      </CardActions>
      <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph dangerouslySetInnerHTML={this.innerHTML(d.attributes.body.processed)}>
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
    );

    return (
      <div style={styles.cardWrapper}>
      {listItems}
      </div>
    );
  }
}

export default RecipeReviewCard;

const wrapper = document.getElementById("card");
wrapper ? ReactDOM.render(<RecipeReviewCard />, wrapper) : false;
