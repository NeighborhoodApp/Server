const helper = require('../helpers/helper')

const coordinate = ["-2.999220773018713", "104.79017833687155"]
const timeline = [
  {
    description: "This is test timelines by warga 1",
    image: "images/imageurl.jpg",
    privacy: "public",
    UserId: 6,
    User: {
      RealEstate: {
        "coordinate": "-2.9985332514737544, 104.790206885603"
      }
    }
  },
  {
    description: "This is test timelines by warga 2",
    image: "images/imageurl.jpg",
    privacy: "member",
    UserId: 2,
    User: {
      RealEstate: {
        "coordinate": "-7.628715699042171, 111.51702820356942"
      }
    }
  },
  {
    description: "This is test timelines by warga 3",
    image: "images/imageurl.jpg",
    privacy: "member",
    UserId: 2,
    User: {
      RealEstate: {
        "coordinate": "-7.628715699042171, 111.51702820356942"
      }
    }
  }
]

describe('Test Haversine Formula', () => {
  it('Success get timeline', async (done) => {
    const res = await helper.calculateDistance(coordinate, timeline)
    expect(res[0]).toHaveProperty("description", "This is test timelines by warga 1");
    done()
  })
  it('Success get timeline', async (done) => {
    const res = await helper.calculateDistance(coordinate, timeline)
    console.log(res)
    expect(res[2]).toHaveProperty("description", "This is test timelines by warga 3");
    done()
  })
})