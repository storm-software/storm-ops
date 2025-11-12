use std::error::Error;
use std::path::PathBuf;
use std::{env, fs, io};

use read_url::*;

use crate::FileFormat;
use crate::file::format::ALL_EXTENSIONS;
use crate::file::source::FileSourceResult;
use crate::file::{FileSource, FileStoredFormat, Format};

/// Describes a file sourced from a file
#[derive(Clone, Debug)]
pub struct FileSourceFile {
  /// Path of configuration file
  name: PathBuf,
}

impl FileSourceFile {
  pub fn new(name: PathBuf) -> Self {
    Self { name }
  }

  fn find_file<F>(
    &self,
    format_hint: Option<F>,
  ) -> Result<(PathBuf, Box<dyn Format>), Box<dyn Error + Send + Sync>>
  where
    F: FileStoredFormat + Format + 'static,
  {
    let filename = if self.name.is_absolute() {
      self.name.clone()
    } else {
      env::current_dir()?.as_path().join(&self.name)
    };

    // First check for an _exact_ match
    if filename.is_file() {
      return if let Some(format) = format_hint {
        Ok((filename, Box::new(format)))
      } else {
        for (format, extensions) in ALL_EXTENSIONS.iter() {
          if extensions
            .contains(&filename.extension().unwrap_or_default().to_string_lossy().as_ref())
          {
            return Ok((filename, Box::new(*format)));
          }
        }

        Err(Box::new(io::Error::new(
          io::ErrorKind::NotFound,
          format!(
            "configuration file \"{}\" is not of a registered file format",
            filename.to_string_lossy()
          ),
        )))
      };
    }

    // Adding a dummy extension will make sure we will not override secondary extensions, i.e. "file.local"
    // This will make the following set_extension function calls to append the extension.
    let mut filename = add_dummy_extension(filename);

    match format_hint {
      Some(format) => {
        for ext in format.file_extensions() {
          filename.set_extension(ext);

          if filename.is_file() {
            return Ok((filename, Box::new(format)));
          }
        }
      }

      None => {
        for format in ALL_EXTENSIONS.keys() {
          for ext in format.extensions() {
            filename.set_extension(ext);

            if filename.is_file() {
              return Ok((filename, Box::new(*format)));
            }
          }
        }
      }
    }

    Err(Box::new(io::Error::new(
      io::ErrorKind::NotFound,
      format!("configuration file \"{}\" not found", self.name.to_string_lossy()),
    )))
  }
}

impl<F> FileSource<F> for FileSourceFile
where
  F: Format + FileStoredFormat + 'static,
{
  fn resolve(
    &self,
    format_hint: Option<F>,
  ) -> Result<FileSourceResult, Box<dyn Error + Send + Sync>> {
    if format_hint.is_none() {
      return Ok(FileSourceResult {
        uri: None,
        content: "{}".into(),
        format: Box::new(FileFormat::default()),
      });
    }

    // Find file
    match self.find_file(format_hint) {
      Ok((filename, format)) => {
        return Ok(FileSourceResult {
          uri: Some(
            env::current_dir()
              .ok()
              .and_then(|base| pathdiff::diff_paths(&filename, base))
              .unwrap_or_else(|| filename.clone())
              .to_string_lossy()
              .into_owned(),
          ),
          content: fs::read_to_string(filename)?,
          format,
        });
      }
      Err(e) => {
        let context = UrlContext::new();

        let url = context.url(self.name.to_str().unwrap_or_default())?;
        let mut reader = url.open()?;

        let mut content = String::default();
        reader.read_to_string(&mut content)?;

        return Ok(FileSourceResult {
          uri: Some(url.to_string()),
          content,
          format: Box::new(find_file_extension(self.name.clone())),
        });
      }
    };
  }
}

fn add_dummy_extension(mut filename: PathBuf) -> PathBuf {
  match filename.extension() {
    Some(extension) => {
      let mut ext = extension.to_os_string();
      ext.push(".");
      ext.push("dummy");
      filename.set_extension(ext);
    }
    None => {
      filename.set_extension("dummy");
    }
  }

  filename
}

fn find_file_extension(filename: PathBuf) -> FileFormat {
  if let Some(extension) = filename.extension() {
    let ext = extension.to_string_lossy();
    for format in ALL_EXTENSIONS.keys() {
      if format.extensions().contains(&ext.as_ref()) {
        return format.clone();
      }
    }
  }

  FileFormat::default()
}
