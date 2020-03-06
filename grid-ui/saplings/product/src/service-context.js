import React from 'react';

const mockCircuits = {
  services: [
    {
      id: 0,
      serviceID: 'cargill-target0',
      selected: false,
      key: 'location'
    },
    {
      id: 1,
      serviceID: 'cargill-target1',
      selected: false,
      key: 'location'
    },
    {
      id: 2,
      serviceID: 'cargill-target2',
      selected: false,
      key: 'location'
    },
    {
      id: 3,
      serviceID: 'cargill-target3',
      selected: false,
      key: 'location'
    },
    {
      id: 4,
      serviceID: 'cargill-target4',
      selected: false,
      key: 'location'
    },
    {
      id: 5,
      serviceID: 'cargill-target5',
      selected: false,
      key: 'location'
    }
  ]
};

const ServiceStateContext = React.createContext();
const ServiceDispatchContext = React.createContext();

const serviceReducer = (state, action) => {
  switch (action.type) {
    case 'select': {
      const { services } = state;
      const index = services.findIndex(
        service => service.serviceID === action.payload.serviceID
      );
      const service = services[index];
      service.selected = !service.selected;
      services[index] = service;
      return { services };
    }
    default:
      throw new Error(`unhandled action type: ${action.type}`);
  }
};

function ServiceProvider({ children }) {
  const [state, dispatch] = React.useReducer(serviceReducer, mockCircuits);

  return (
    <ServiceStateContext.Provider value={state}>
      <ServiceDispatchContext.Provider value={dispatch}>
        {children}
      </ServiceDispatchContext.Provider>
    </ServiceStateContext.Provider>
  );
}

function useServiceState() {
  const context = React.useContext(ServiceStateContext);
  if (context === undefined) {
    throw new Error('useServiceState must be used within a ServiceProvider');
  }
  return context;
}

function useServiceDispatch() {
  const context = React.useContext(ServiceDispatchContext);
  if (context === undefined) {
    throw new Error('useServiceDispatch must be used within a ServiceProvider');
  }
  return context;
}

export { ServiceProvider, useServiceState, useServiceDispatch };
