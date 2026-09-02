import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ISO_NUMERIC_TO_COUNTRY } from '../countryCodes';

const GEO_URL = '/assets/map/asean-countries-50m.json';

function AseanMap({ selectedCountry, onSelectCountry }) {
  return (
    <div className="overflow-hidden rounded-2xl border-b-[5px] border-sky-600 bg-sky-100 shadow-[0_4px_0_0_rgb(2,132,199)]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [112, 6], scale: 750 }}
        width={800}
        height={520}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const country = ISO_NUMERIC_TO_COUNTRY[geo.id];
              const isSelected = country?.name === selectedCountry;
              return (
                <Geography
                  key={geo.rsmKey}
                  geo={geo}
                  onClick={() => country && onSelectCountry(country.name)}
                  style={{
                    default: {
                      fill: isSelected ? '#65a30d' : '#38bdf8',
                      stroke: '#0284c7',
                      strokeWidth: 1,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    hover: {
                      fill: '#a3e635',
                      stroke: '#0284c7',
                      strokeWidth: 1,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: '#65a30d',
                      stroke: '#0284c7',
                      strokeWidth: 1,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

export default AseanMap;
