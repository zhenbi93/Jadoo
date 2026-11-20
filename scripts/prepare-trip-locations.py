"""Convert the GeoNames country, admin1 and cities500 downloads into frontend assets."""

from collections import defaultdict
from pathlib import Path
from zipfile import ZipFile
import json
import sys


def rows(path):
    with path.open(encoding="utf-8") as source:
        for line in source:
            if line.strip() and not line.startswith("#"):
                yield line.rstrip("\r\n").split("\t")


def write_json(path, value):
    path.write_text(
        json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )


def main(source):
    web = Path(__file__).resolve().parents[1] / "apps" / "web"
    location_dir = web / "public" / "trip-locations"
    location_dir.mkdir(parents=True, exist_ok=True)

    countries = {row[0]: row[4] for row in rows(source / "countryInfo.txt")}
    admin_names = {row[0]: row[1] for row in rows(source / "admin1CodesASCII.txt")}
    grouped = defaultdict(lambda: defaultdict(set))

    with ZipFile(source / "cities500.zip") as archive, archive.open("cities500.txt") as cities:
        for line in cities:
            row = line.decode("utf-8").rstrip("\r\n").split("\t")
            country, admin_code = row[8], row[10]
            if country in countries:
                region = admin_names.get(f"{country}.{admin_code}")
                grouped[country][region].add(row[1])

    for country, regions in sorted(grouped.items()):
        country_data = [
            {"name": name, "cities": sorted(names, key=lambda name: (name.casefold(), name))}
            for name, names in sorted(
                regions.items(), key=lambda entry: (entry[0] is None, (entry[0] or "").casefold())
            )
        ]
        write_json(location_dir / f"{country}.json", country_data)

    country_list = [
        {"code": code, "name": countries[code]}
        for code in sorted(grouped, key=lambda code: countries[code].casefold())
    ]
    write_json(web / "src" / "trip-countries.json", country_list)


if __name__ == "__main__":
    main(Path(sys.argv[1]))
