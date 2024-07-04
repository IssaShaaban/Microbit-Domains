









  export let countPerRoom = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    "-140",
                    "50"
                ]
            },
            "properties": {
                "url": "https://i.imgur.com/lYlVKFy.png",
                "count": ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    "-10",
                    "56"
                ]
            },
            "properties": {
                "url": "https://i.imgur.com/lYlVKFy.png",
                "count": ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    "155",
                    "20"
                ]
            },
            "properties": {
                "url": "https://i.imgur.com/lYlVKFy.png",
                "count": ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    "186",
                    "-54"
                ]
            },
            "properties": {
                "url": "https://i.imgur.com/lYlVKFy.png",
                "count": ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    "-15",
                    "-45"
                ]
            },
            "properties": {
                "url": "https://i.imgur.com/lYlVKFy.png",
                "count": ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    "-150",
                    "-49"
                ]
            },
            "properties": {
                "url": "https://i.imgur.com/lYlVKFy.png",
                "count": ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    "80",
                    "-100"
                ]
            },
            "properties": {
                "url": "https://i.imgur.com/lYlVKFy.png",
                "count": ""
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    "-10",
                    "-114"
                ]
            },
            "properties": {
                "url": "https://i.imgur.com/lYlVKFy.png",
                "count": ""
            }
        }
    ]
}
  





export let parameter = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [-54, -77],
              [-51, -84],
              [-42, -94],
              [-35, -97],
              [-35, -142],
              [0, -142],
              [0, -132],
              [-25, -132],
              [-25, -97],
              [55, -97],
              [55, -132],
              [30, -132],
              [30, -142],
              [65, -142],
              [65, -97],
              [73, -94],
              [83, -84],
              [85, -77],
              [175, -77],
              [175, -32],
              [90, -32],
              [160, 39],
              [136, 63],
              [66, -8],
              [66, 133],
              [-194, 133],
              [-194, -77]
            ]
          ]
        }
      }
    ]
  }
  

export let floorplan = {
  "type": "FeatureCollection",
  "features": [
      {
          "type": "Feature",
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [-54, -77],
                      [-51, -84],
                      [-42, -94],
                      [-35, -97],
                      [-35, -142],
                      [0, -142],
                      [0, -132],
                      [-25, -132],
                      [-25, -97],
                      [55, -97],
                      [55, -132],
                      [30, -132],
                      [30, -142],
                      [65, -142],
                      [65, -97],
                      [73, -94],
                      [83, -84],
                      [85, -77],
                      [175, -77],
                      [175, -32],
                      [90, -32],
                      [160, 39],
                      [136, 63],
                      [66, -8],
                      [66, 133],
                      [-194, 133],
                      [-194, -77]
                  ]
              ]
          }
      }
  ]
}


export let roomsdata = {
  "type": "FeatureCollection",
  "features": [
      {
          "type": "Feature",
          "properties": {
              "name": "Main Room",
              "center": [15, -50],
              "staffIcon": [0, -50],
              "prisonerIcon": [30, -50]
          },
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [-24, -22],
                      [-44, -32],
                      [-44, -77],
                      [-35, -87],
                      [-35, -62],
                      [65, -62],
                      [65, -87],
                      [75, -77],
                      [75, -32], 
                      [66, -22]
                  ]
              ]
          }
      },
      {
          "type": "Feature",
          "properties": {
              "name": "Outdoor Area",
              "center": [-110, 50],
              "staffIcon": [-125, 50],
              "prisonerIcon": [-95, 50]
          },
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [-54, -22],
                      [-184, -22],
                      [-184, 123],
                      [-34, 123],
                      [-34, -12]
                  ]
              ]
          }
      },
      {
          "type": "Feature",
          "properties": {
              "name": "Cell Block",
              "center": [-118, -49],
              "staffIcon": [-133, -49],
              "prisonerIcon": [-103, -49]
          },
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [-54, -32],
                      [-184, -32],
                      [-184, -67],
                      [-54, -67]
                  ]
              ]
          }
      },
      {
          "type": "Feature",
          "properties": {
              "name": "Solitary Confinement",
              "center": [126, -54],
              "staffIcon": [111, -54],
              "prisonerIcon": [141, -54]
          },
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [85, -42],
                      [165, -42],
                      [165, -67],
                      [85, -67]
                  ]
              ]
          }
      },
      {
          "type": "Feature",
          "properties": {
              "name": "Cafeteria",
              "center": [16, 56],
              "staffIcon": [1, 56],
              "prisonerIcon": [31, 56]
          },
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [-24, -12],
                      [-24, 123],
                      [56, 123],
                      [56, -12]
                  ]
              ]
          }
      },
      {
          "type": "Feature",
          "properties": {
              "name": "Security Room",
              "center": [110, 13],
              "staffIcon": [95, 13],
              "prisonerIcon": [140, 13]
          },
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [75, -32],
                      [146, 39],
                      [136, 49],
                      [66, -22]
                  ]
              ]
          }
      },
      {
          "type": "Feature",
          "properties": {
              "name": "PVA",
              "center": [14, -79],
              "staffIcon": [-1, -79],
              "prisonerIcon": [29, -79]
          },
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [-25, -72],
                      [-25, -87],
                      [55, -87],
                      [55, -72]
                  ]
              ]
          }
      },
      {
          "type": "Feature",
          "properties": {
              "name": "VA",
              "center": [15, -114],
              "staffIcon": [0, -114],
              "prisonerIcon": [30, -114]
          },
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [-25, -132],
                      [-25, -97],
                      [55, -97],
                      [55, -132]
                  ]
              ]
          }
      }
  ]
}
