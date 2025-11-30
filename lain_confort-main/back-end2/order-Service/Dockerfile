# ---------- BUILD STAGE ----------
FROM maven:3.9.6-amazoncorretto-17 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Build the JAR (skip tests to speed up)
RUN mvn clean package -DskipTests

# ---------- RUNTIME STAGE ----------
FROM amazoncorretto:17-alpine-jdk

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
