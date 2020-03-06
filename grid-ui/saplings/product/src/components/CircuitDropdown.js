/* eslint-disable react/prop-types */
/**
 * Copyright 2018-2020 Cargill Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useServiceState, useServiceDispatch } from '../service-context';
import useOnClickOutside from '../hooks/on-click-outside';
import './CircuitDropdown.scss';

const CircuitDropdown = () => {
  const headerPlaceholder = 'Select a service';
  const { services } = useServiceState();
  const serviceDispatch = useServiceDispatch();
  const [listOpen, setListOpen] = useState(false);
  const [headerText, setHeaderText] = useState(headerPlaceholder);

  const caretUp = <FontAwesomeIcon icon="caret-up" />;
  const caretDown = <FontAwesomeIcon icon="caret-down" />;

  const listItems = services.map(item => (
    <div
      className="dd-list-item"
      role="button"
      tabIndex="0"
      key={item.id}
      onClick={() =>
        serviceDispatch({
          type: 'select',
          payload: {
            serviceID: item.serviceID
          }
        })
      }
      onKeyPress={() =>
        serviceDispatch({
          type: 'select',
          payload: {
            serviceID: item.serviceID
          }
        })
      }
    >
      {item.serviceID}
      {item.selected && <FontAwesomeIcon icon="check" />}
    </div>
  ));

  const ref = useRef();
  useOnClickOutside(ref, () => setListOpen(false));

  useEffect(() => {
    const selectedServices = services.filter(service => service.selected);

    if (selectedServices.length === 1) {
      setHeaderText(selectedServices[0].serviceID);
    } else if (selectedServices.length > 1) {
      setHeaderText(`${selectedServices.length} services selected`);
    } else {
      setHeaderText(headerPlaceholder);
    }
  });

  return (
    <div className="dd-wrapper" ref={ref}>
      <div
        className="dd-header"
        role="button"
        tabIndex="0"
        onClick={() => setListOpen(!listOpen)}
        onKeyPress={() => setListOpen(!listOpen)}
      >
        <div className="dd-header-text">{headerText}</div>
        {listOpen ? caretUp : caretDown}
      </div>
      {listOpen && <ul className="dd-list">{listItems}</ul>}
    </div>
  );
};

export default CircuitDropdown;
