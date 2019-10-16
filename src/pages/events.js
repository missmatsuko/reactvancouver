import React from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import moment from 'moment'
import {
  RVAvatar,
  RVBox,
  RVButton,
  RVCard,
  RVContainer,
  RVGrid,
  RVIcon,
  RVText,
  RVLink,
  EventDetails,
} from 'components'
import Layout from 'layouts'

const styles = {
  list: {
    listStyle: 'none',
    minWidth: 200,
  },
}

function getNextEvent(events) {
  const upcomingEvents = events.filter(event =>
    moment(event.node.startDate).isAfter()
  )
  return upcomingEvents[upcomingEvents.length - 1]
}

function getUpcomingEvents(events) {
  return events.filter(event => moment(event.node.startDate).isAfter())
}

function getPastEvents(events) {
  return events.filter(event => moment(event.node.startDate).isBefore())
}

class Events extends React.Component {
  state = {
    seeAllEvents: false,
  }

  toggleEventsList = () => {
    this.setState(({ seeAllEvents }) => ({ seeAllEvents: !seeAllEvents }))
  }

  _renderEventListItem = ({ id, slug, startDate }) => (
    <li key={id}>
      <RVLink navigate={`/event/${slug}`}>
        {moment(startDate).format('MMMM Do, Y')}
      </RVLink>
    </li>
  )

  render() {
    const { seeAllEvents } = this.state
    const { allContentfulEvents } = this.props.data
    const events = allContentfulEvents && allContentfulEvents.edges
    const upcomingEvents = getUpcomingEvents(events)
    const pastEvents = getPastEvents(events)
    const event = getNextEvent(events)

    return (
      <Layout
        title="Events"
        description="React meetups, hacknights and social events in Vancouver."
        keywords="events, meetups, hacknights, react, vancouver"
      >
        <RVContainer pt8>
          <RVGrid
            gridTemplateColumns={[
              'repeat(1, 1fr)',
              'min-content 1fr',
              'min-content 1fr',
            ]}
          >
            <RVBox tag="ul" style={styles.list}>
              <RVText subheading>Upcoming Events</RVText>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(({ node }) => {
                  return this._renderEventListItem({ ...node })
                })
              ) : (
                <RVText>No Upcoming Events</RVText>
              )}
              <RVText subheading>Past Events</RVText>
              {pastEvents.map(({ node }, index) => {
                if (!seeAllEvents && index >= 4) {
                  return null
                }
                return this._renderEventListItem({ ...node })
              })}
              <RVButton onClick={this.toggleEventsList}>
                {seeAllEvents ? 'Shorten List' : 'Show All'}
              </RVButton>
            </RVBox>

            <RVCard px3 py2>
              {event ? (
                <EventDetails {...event.node} />
              ) : (
                <RVText alignCenter label>
                  No upcoming events
                </RVText>
              )}
            </RVCard>
          </RVGrid>
          <RVBox grey radius alignCenter p3 my4>
            <RVText subheading>Have an idea for a talk?</RVText>
            <RVBox my3>
              <RVLink navigate="/#contact-us">
                <RVButton decorative>Reach Out</RVButton>
              </RVLink>
            </RVBox>
            <RVText>
              We are always looking for presenters with interesting ideas,
              projects or tips to share.
            </RVText>
          </RVBox>
        </RVContainer>
      </Layout>
    )
  }
}

export default Events

Events.propTypes = {
  data: PropTypes.object.isRequired,
}

export const query = graphql`
  query eventsQuery {
    allContentfulEvents(
      limit: 1000
      sort: { fields: [startDate], order: DESC }
    ) {
      edges {
        node {
          id
          slug
          title
          description {
            childMarkdownRemark {
              html
            }
          }
          startDate
          endDate
          venueName
          venueAddress
          eventbriteEventId
          location {
            lat
            lon
          }
          talks {
            id
            title
            speakers {
              id
              firstName
              lastName
              jobTitle
              company
              githubLink
              linkedInLink
              profilePicture {
                fixed(height: 50, width: 50) {
                  ...GatsbyContentfulFixed
                }
              }
            }
          }
        }
      }
    }
  }
`
