FROM        --platform=$TARGETOS/$TARGETARCH node:18
FROM        --platform=$TARGETOS/$TARGETARCH postgres:16

LABEL       author="TheAFKGamer10" maintainer="mail@afkhosting.win"

RUN         apt update \
            && apt -y install ffmpeg iproute2 git sqlite3 libsqlite3-dev python3 python3-dev ca-certificates dnsutils tzdata zip tar curl build-essential libtool iputils-ping libnss3 tini fontconfig openssl sqlite tar \
            && useradd -m -D -h /home/container container

RUN         npm install npm typescript ts-node @types/node --location=global
RUN         npm install pnpm --location=global

USER        container
ENV         USER=container HOME=/home/container
WORKDIR     /home/container

STOPSIGNAL SIGINT

COPY        --chown=container:container ./../entrypoint.sh /entrypoint.sh
RUN         chmod +x /entrypoint.sh
ENTRYPOINT    ["/usr/bin/tini", "-g", "--"]
CMD         ["/entrypoint.sh"]