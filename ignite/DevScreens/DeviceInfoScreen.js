// An All Components Screen is a great way to dev and quick-test components
import React from 'react'
import {
  View,
  ScrollView,
  Text,
  Image,
  NetInfo,
  TouchableOpacity,
} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import PropTypes from 'prop-types'
import { Metrics, Images } from './DevTheme'
import styles from './styles/DeviceInfoScreenStyles'

const HARDWARE_DATA = [
  { title: 'Device Manufacturer', info: DeviceInfo.getManufacturer() },
  { title: 'Device Name', info: DeviceInfo.getDeviceName() },
  { title: 'Device Model', info: DeviceInfo.getModel() },
  { title: 'Device Unique ID', info: DeviceInfo.getUniqueID() },
  { title: 'Device Locale', info: DeviceInfo.getDeviceLocale() },
  { title: 'Device Country', info: DeviceInfo.getDeviceCountry() },
  { title: 'User Agent', info: DeviceInfo.getUserAgent() },
  { title: 'Screen Width', info: Metrics.screenWidth },
  { title: 'Screen Height', info: Metrics.screenHeight },
]

const OS_DATA = [
  { title: 'Device System Name', info: DeviceInfo.getSystemName() },
  { title: 'Device ID', info: DeviceInfo.getDeviceId() },
  { title: 'Device Version', info: DeviceInfo.getSystemVersion() },
]

const APP_DATA = [
  { title: 'Bundle Id', info: DeviceInfo.getBundleId() },
  { title: 'Build Number', info: DeviceInfo.getBuildNumber() },
  { title: 'App Version', info: DeviceInfo.getVersion() },
  { title: 'App Version (Readable)', info: DeviceInfo.getReadableVersion() },
]

export default class DeviceInfoScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isConnected: false,
      connectionInfo: null,
      connectionInfoHistory: [],
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.setConnected)
    NetInfo.isConnected.fetch().done(this.setConnected)
    NetInfo.addEventListener('connectionChange', this.setConnectionInfo)
    NetInfo.getConnectionInfo().done(this.setConnectionInfo)
    NetInfo.addEventListener(
      'connectionChange',
      this.updateConnectionInfoHistory,
    )
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.setConnected,
    )
    NetInfo.removeEventListener('connectionChange', this.setConnectionInfo)
    NetInfo.removeEventListener(
      'connectionChange',
      this.updateConnectionInfoHistory,
    )
  }

  setConnected = isConnected => {
    this.setState({ isConnected })
  }

  setConnectionInfo = connectionInfo => {
    this.setState({ connectionInfo })
  }

  updateConnectionInfoHistory = connectionInfo => {
    const [...connectionInfoHistory] = this.state
    connectionInfoHistory.push(connectionInfo)
    this.setState({ connectionInfoHistory })
  }

  netInfo() {
    const { isConnected, connectionInfo, connectionInfoHistory } = this.state
    return [
      {
        title: 'Connection',
        info: isConnected ? 'Online' : 'Offline',
      },
      {
        title: 'Connection Info',
        info: JSON.stringify(connectionInfo),
      },
      {
        title: 'Connection Info History',
        info: JSON.stringify(connectionInfoHistory),
      },
    ]
  }

  renderCard(cardTitle, rowData) {
    return (
      <View>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>{cardTitle.toUpperCase()}</Text>
        </View>
        {this.renderRows(rowData)}
      </View>
    )
  }

  renderRows = rowData => {
    return rowData.map(cell => {
      const { title, info } = cell
      return (
        <View key={title} style={styles.rowContainer}>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>{title}</Text>
          </View>
          <View style={styles.rowInfoContainer}>
            <Text style={styles.rowInfo}>{info}</Text>
          </View>
        </View>
      )
    })
  }

  render() {
    const {
      navigation: { goBack },
    } = this.props
    return (
      <View style={styles.mainContainer}>
        <Image
          source={Images.background}
          style={styles.backgroundImage}
          resizeMode="stretch"
        />
        <TouchableOpacity
          onPress={() => goBack()}
          style={{
            position: 'absolute',
            paddingTop: 30,
            paddingHorizontal: 5,
            zIndex: 10,
          }}
        >
          <Image source={Images.backButton} />
        </TouchableOpacity>
        <ScrollView style={styles.container}>
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Image source={Images.deviceInfo} style={styles.logo} />
            <Text style={styles.titleText}>Device Info</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionText}>
              Dedicated to identifying specifics of the device. All info useful
              for identifying outlying behaviour specific to a device.
            </Text>
          </View>
          <View style={{ padding: 10 }}>
            {this.renderCard('Device Hardware', HARDWARE_DATA)}
            {this.renderCard('Device OS', OS_DATA)}
            {this.renderCard('App Info', APP_DATA)}
            {this.renderCard('Net Info', this.netInfo())}
          </View>
        </ScrollView>
      </View>
    )
  }
}

DeviceInfoScreen.propTypes = {
  navigation: PropTypes.shape({}),
}

DeviceInfoScreen.defaultProps = {
  navigation: {},
}
