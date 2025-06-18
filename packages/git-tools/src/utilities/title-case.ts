const ACRONYMS = [
  "3D",
  "4D",
  "5G",
  "6G",
  "7G",
  "8G",
  "ACID",
  "AES",
  "AI",
  "AJAX",
  "API",
  "AR",
  "ASCII",
  "B2B",
  "B2C",
  "BFF",
  "BI",
  "BIOS",
  "BGP",
  "BOM",
  "BYOD",
  "C2C",
  "CAGR",
  "CAPTCHA",
  "CD",
  "CDN",
  "CDP",
  "CI",
  "CI/CD",
  "CIAM",
  "CICD",
  "CLI",
  "CMDB",
  "CORS",
  "CPU",
  "CRUD",
  "CSR",
  "CSS",
  "CX",
  "DAG",
  "DBMS",
  "DDoS",
  "DNS",
  "DNSSEC",
  "DOM",
  "DR",
  "DRM",
  "DWH",
  "E2E",
  "EAI",
  "EKS",
  "EOF",
  "EOD",
  "ETC",
  "ETL",
  "EULA",
  "FIDO",
  "FQDN",
  "FTP",
  "FaaS",
  "GDPR",
  "GCP",
  "GPU",
  "GUID",
  "GUI",
  "GZIP",
  "HCI",
  "HDD",
  "HDFS",
  "HIPAA",
  "HMAC",
  "HOTP",
  "HSM",
  "HTML",
  "HTTP",
  "HTTP/2",
  "HTTP/2.0",
  "HTTP/3",
  "HTTP/3.0",
  "HTTP2",
  "HTTPS",
  "HTTPS/2",
  "HTTPS/3",
  "HTTPS3",
  "IAM",
  "IAMM",
  "IAMT",
  "IaaS",
  "ID",
  "IMAP",
  "IP",
  "IPFS",
  "IoT",
  "JSON",
  "JSONP",
  "JWT",
  "K8s",
  "KMS",
  "KPI",
  "LAN",
  "LHS",
  "LXC",
  "MFA",
  "ML",
  "MLOps",
  "MVC",
  "MVP",
  "NAS",
  "NAT",
  "NDA",
  "NFS",
  "NIST",
  "NLP",
  "NPS",
  "OCR",
  "OEM",
  "OKR",
  "OLAP",
  "OLTP",
  "OOP",
  "ORM",
  "OS",
  "OTP",
  "P2P",
  "PDP",
  "PaaS",
  "PCI",
  "PKI",
  "PP",
  "PWA",
  "PX",
  "QA",
  "RAID",
  "RAM",
  "RDS",
  "REST",
  "RHS",
  "RPC",
  "RPA",
  "RUM",
  "RSS",
  "SAN",
  "SASE",
  "SDLC",
  "SDK",
  "SEO",
  "SFTP",
  "SIEM",
  "SLA",
  "SMB",
  "SMTP",
  "SOAP",
  "SOC",
  "SOA",
  "SPDY",
  "SPF",
  "SQL",
  "SRV",
  "SRE",
  "SSH",
  "SSDL",
  "SSO",
  "SSL",
  "SSR",
  "TDD",
  "TLD",
  "TLS",
  "TLS1.3",
  "TOTP",
  "TRPC",
  "TTL",
  "UDP",
  "UI",
  "UID",
  "URI",
  "URL",
  "UTF",
  "UUID",
  "UX",
  "VM",
  "VLAN",
  "VPN",
  "VR",
  "WAF",
  "WAN",
  "WLAN",
  "WPA",
  "XACML",
  "XML",
  "XSRF",
  "XSS",
  "XR",
  "YAML",
  "ZTA"
];

const FORMAT_MAPPING = ACRONYMS.reduce(
  (ret, acronym) => {
    ret[acronym.toLowerCase()] = acronym;
    return ret;
  },
  {
    cspell: "CSpell",
    eslint: "ESLint",
    nx: "Nx"
  } as Record<string, string>
);

const LOWER_CASE_WHEN_NOT_FIRST: string[] = [
  "a",
  "an",
  "the",
  "is",
  "are",
  "of",
  "and",
  "to",
  "in",
  "for",
  "on",
  "with",
  "as",
  "at",
  "by"
] as const;

/**
 * Convert the input string to title case.
 *
 *  @remarks
 * "This Is An Example"
 *
 * @param input - The input string.
 * @returns The title cased string.
 */
export function titleCase<T extends string | undefined>(input?: T): T {
  if (!input) {
    return input as T;
  }

  const formatSegment = (segment: string) =>
    segment
      .toLowerCase()
      .split(/[\s\-_]+/)
      .filter(Boolean)
      .map((word, index) => {
        if (
          LOWER_CASE_WHEN_NOT_FIRST.includes(word.toLowerCase()) &&
          index > 0
        ) {
          return word.toLowerCase();
        }

        if (Object.keys(FORMAT_MAPPING).includes(word.toLowerCase())) {
          return FORMAT_MAPPING[word.toLowerCase()];
        }

        return `${
          word
            ? word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)
            : word
        }`;
      })
      .join(" ");

  return input
    .split(/\s+-\s+/)
    .map(part => formatSegment(part))
    .join(" - ") as T;
}
