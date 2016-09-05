import React, { Component } from 'react';

import reactBrickwork, { SpringGrid, CSSGrid,
  makeResponsive, measureItems } from 'react-stonecutter';

class Grid extends Component {
  constructor() {
    super();

    this.state = {
      windowWidth: window.innerWidth
    };

    this.handleResize = this.handleResize.bind(this);
  }
  componentWillMount() {
    this.createGrid(this.props);
  }
  createGrid({ useCSS, measured, responsive }) {
    let Grid = useCSS ? CSSGrid : SpringGrid;

    if (measured) {
      Grid = measureItems(Grid);
    }

    if (responsive) {

      Grid = makeResponsive(Grid, {
        maxWidth: 849,
        minPadding: 1,
        defaultColumns: 3
      });
    }

    this.setState({ Grid });

  }
  handleResize(e) {
    this.setState({windowWidth: window.innerWidth});
  }
  componentDidMount(){
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleResize);
  }
  render() {
    const { children, useCSS, responsive, layout, enterExitStyle,
      duration, easing, stiffness, damping, columns, ...rest } = this.props;

    const { Grid } = this.state;

    const gridLayout = reactBrickwork.layout[layout];
    const gridEnterExitStyle = reactBrickwork.enterExitStyle[enterExitStyle];

    const renderGrid = () => (
      <Grid
      {...rest}
      className="Feed-grid"
      component="ul"
      columns={!responsive ? columns : null}
      gutterWidth={13}
      gutterHeight={10}
      layout={gridLayout}
      enter={gridEnterExitStyle.enter}
      entered={gridEnterExitStyle.entered}
      exit={gridEnterExitStyle.exit}
      perspective={600}
      duration={useCSS ? duration : null}
      easing={useCSS ? easing : null}
      springConfig={!useCSS && stiffness && damping ?
        { stiffness, damping } : null}>
      {children}
      </Grid>
    );

    const renderMobileGrid = () => (
      <ul className="Feed-grid-mobile">
        {children}
      </ul>
    );
    return (
      <div>
      { this.state.windowWidth < 620 ? renderMobileGrid() : renderGrid() }
      </div>
    )
  }
}

export default Grid;
