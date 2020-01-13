/*
 * Copyright 2020 Cargill Incorporated
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
 * -----------------------------------------------------------------------------
 */

use std::error::Error;
use std::fmt;
use std::io::Read;
use std::{fs::File, path::Path};

pub struct Keys {
    pub public_key: String,
    pub private_key: String,
}

impl Keys {
    fn new(public_key: String, private_key: String) -> Self {
        Self {
            public_key: public_key,
            private_key: private_key,
        }
    }
}

pub fn load_scabbard_admin_keys(key_name: &str) -> Result<Keys, KeyError> {
    let private_key_filename = format!("/etc/grid/keys/{}.priv", key_name);
    let private_key_path = Path::new(&private_key_filename);
    if !private_key_path.exists() {
        return Err(KeyError(format!(
            "No such private key file: {}",
            private_key_path.display()
        )));
    }

    let public_key_filename = format!("/etc/grid/keys/{}.pub", key_name);
    let public_key_path = Path::new(&public_key_filename);
    if !Path::new(&public_key_filename).exists() {
        return Err(KeyError(format!(
            "No such public key file: {}",
            public_key_path.display()
        )));
    }

    let private_key = read_key_from_file(private_key_filename)?;
    let public_key = read_key_from_file(public_key_filename)?;

    Ok(Keys::new(public_key, private_key))
}

fn read_key_from_file(filename: String) -> Result<String, KeyError> {
    let mut f = File::open(&filename)?;

    let mut contents = String::new();
    f.read_to_string(&mut contents)?;

    let key_str = match contents.lines().next() {
        Some(k) => k,
        None => {
            return Err(KeyError(format!("Empty key file: {}", filename)));
        }
    };

    Ok(key_str.to_string())
}

#[derive(Debug)]
pub struct KeyError(pub String);

impl Error for KeyError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None
    }
}

impl fmt::Display for KeyError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl From<std::io::Error> for KeyError {
    fn from(err: std::io::Error) -> KeyError {
        KeyError(err.to_string())
    }
}
